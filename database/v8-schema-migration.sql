-- ============================================
-- KG4EPIC v8 Schema Migration Script
-- Fresh start with EPIC-TIDE v8 architecture
-- ============================================

-- WARNING: This creates a fresh v8 database
-- All existing v5.1 tables will be in old database

-- Create new database (run as superuser)
-- CREATE DATABASE epic_tide_v8;

-- Connect to new database
-- \c epic_tide_v8;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- ============================================
-- 1. BLUEPRINTS Table (Human-Authored)
-- ============================================

DROP TABLE IF EXISTS blueprints CASCADE;
CREATE TABLE blueprints (
  -- Identity
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  
  -- YAML Storage
  yaml_content TEXT NOT NULL,
  yaml_hash VARCHAR(64) NOT NULL,
  
  -- Parsed Fields
  vision TEXT NOT NULL,
  goals JSONB NOT NULL,
  scope TEXT,
  constraints JSONB,
  works JSONB,
  success_criteria JSONB,
  evidence_required JSONB,
  
  -- Workflow
  status VARCHAR(20) DEFAULT 'draft' 
    CHECK (status IN ('draft', 'pending_confirm', 'confirmed', 'in_progress', 'complete')),
  confirmed_at TIMESTAMP,
  confirmed_by VARCHAR(255),
  locked BOOLEAN DEFAULT FALSE,
  
  -- Phase Management
  phase_number INTEGER NOT NULL DEFAULT 1,
  previous_phase_id UUID REFERENCES blueprints(id),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_blueprints_status ON blueprints(status);
CREATE INDEX idx_blueprints_slug ON blueprints(slug);

-- ============================================
-- 2. SEMANTIC_EXECUTIONS Table (AI-Optimized)
-- ============================================

DROP TABLE IF EXISTS semantic_executions CASCADE;
CREATE TABLE semantic_executions (
  -- Identity
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blueprint_id UUID REFERENCES blueprints(id) ON DELETE CASCADE,
  blueprint_slug VARCHAR(255) NOT NULL,
  tide_number INTEGER NOT NULL DEFAULT 1,
  
  -- Semantic Fields
  semantic_summary TEXT NOT NULL,
  semantic_tags TEXT[] NOT NULL,
  key_decisions TEXT[],
  key_constraints TEXT[],
  
  -- Work Tracking
  work_atoms JSONB NOT NULL,
  work_status JSONB NOT NULL,
  
  -- Multi-tier Embeddings (using existing services)
  embedding_e5 vector(1024),        -- E5-large-v2
  embedding_ada002 vector(1536),    -- text-embedding-ada-002
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' 
    CHECK (status IN ('pending', 'in_progress', 'success', 'partial', 'failed')),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  -- Evidence
  evidence_collected JSONB,
  verification_results JSONB,
  
  -- Learning
  learnings JSONB,
  adaptations JSONB,
  
  -- TIDE Management
  can_continue_tide BOOLEAN DEFAULT TRUE,
  phase_change_reason TEXT,
  
  UNIQUE(blueprint_id, tide_number)
);

CREATE INDEX idx_semantic_status ON semantic_executions(status);
CREATE INDEX idx_semantic_blueprint ON semantic_executions(blueprint_id);
CREATE INDEX idx_embedding_e5 ON semantic_executions 
  USING ivfflat (embedding_e5 vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_embedding_ada002 ON semantic_executions 
  USING ivfflat (embedding_ada002 vector_cosine_ops) WITH (lists = 100);

-- ============================================
-- 3. CONFIRMATION_RECORDS Table
-- ============================================

DROP TABLE IF EXISTS confirmation_records CASCADE;
CREATE TABLE confirmation_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blueprint_id UUID REFERENCES blueprints(id) ON DELETE CASCADE,
  
  -- Confirmation Details
  confirmed_by VARCHAR(255) NOT NULL,
  confirmed_at TIMESTAMP DEFAULT NOW(),
  confirmation_type VARCHAR(20) 
    CHECK (confirmation_type IN ('initial', 'phase_change', 'abort')),
  
  -- What was confirmed
  confirmed_vision TEXT,
  confirmed_goals JSONB,
  confirmed_constraints JSONB,
  confirmed_criteria JSONB,
  
  -- Resources
  api_keys_provided JSONB,  -- Encrypted/masked
  resources_allocated JSONB,
  
  -- Lock
  blueprint_locked BOOLEAN DEFAULT TRUE,
  lock_hash VARCHAR(64),
  
  -- Notes
  human_notes TEXT,
  conditions TEXT[]
);

CREATE INDEX idx_confirmation_blueprint ON confirmation_records(blueprint_id);

-- ============================================
-- 4. EVIDENCE_RECORDS Table
-- ============================================

DROP TABLE IF EXISTS evidence_records CASCADE;
CREATE TABLE evidence_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  execution_id UUID REFERENCES semantic_executions(id) ON DELETE CASCADE,
  
  -- Evidence Identity
  work_key VARCHAR(255) NOT NULL,
  evidence_type VARCHAR(50),
  
  -- Evidence Content
  evidence_data JSONB NOT NULL,
  verification_passed BOOLEAN,
  
  -- Artifacts
  artifacts JSONB,
  logs TEXT,
  metrics JSONB,
  
  -- Timestamp
  collected_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(execution_id, work_key)
);

CREATE INDEX idx_evidence_execution ON evidence_records(execution_id);
CREATE INDEX idx_evidence_type ON evidence_records(evidence_type);

-- ============================================
-- 5. PATTERNS_LIBRARY Table (AI-Only)
-- ============================================

DROP TABLE IF EXISTS patterns_library CASCADE;
CREATE TABLE patterns_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Pattern Identity
  pattern_key VARCHAR(255) UNIQUE NOT NULL,
  pattern_type VARCHAR(50),
  
  -- Problem-Solution Pair
  problem_description TEXT NOT NULL,
  solution_description TEXT NOT NULL,
  
  -- Embeddings for similarity search
  problem_embedding_e5 vector(1024),
  problem_embedding_ada002 vector(1536),
  solution_embedding_e5 vector(1024),
  solution_embedding_ada002 vector(1536),
  
  -- Applicability
  applicability_score DECIMAL(3,2) CHECK (applicability_score >= 0 AND applicability_score <= 1),
  usage_count INTEGER DEFAULT 0,
  success_rate DECIMAL(3,2),
  
  -- Evidence
  source_executions UUID[],
  evidence_links JSONB,
  
  -- Metadata
  discovered_at TIMESTAMP DEFAULT NOW(),
  last_used_at TIMESTAMP,
  tags TEXT[]
);

CREATE INDEX idx_pattern_type ON patterns_library(pattern_type);
CREATE INDEX idx_pattern_score ON patterns_library(applicability_score DESC);
CREATE INDEX idx_problem_e5 ON patterns_library 
  USING ivfflat (problem_embedding_e5 vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_problem_ada002 ON patterns_library 
  USING ivfflat (problem_embedding_ada002 vector_cosine_ops) WITH (lists = 100);

-- ============================================
-- 6. Helper Functions
-- ============================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_blueprints_updated_at 
  BEFORE UPDATE ON blueprints 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. Initial Test Data
-- ============================================

-- Insert first blueprint (example)
INSERT INTO blueprints (slug, name, vision, goals, yaml_content, yaml_hash, status)
VALUES (
  'kg4epic-v8-foundation',
  'KG4EPIC v8 Foundation',
  'Create a clean v8 implementation of KG4EPIC that demonstrates EPIC-TIDE v8 principles',
  '["Deploy v8 schema", "Implement CONFIRM gateway", "Enable AI autonomy"]'::jsonb,
  '# BLUEPRINT: KG4EPIC v8 Foundation
vision: |
  Create a clean v8 implementation...
goals:
  - Deploy v8 schema
  - Implement CONFIRM gateway',
  SHA256('test-content'),
  'draft'
);

-- ============================================
-- Verification Queries
-- ============================================

-- Check all tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Expected output:
-- blueprints
-- confirmation_records
-- evidence_records
-- patterns_library
-- semantic_executions

-- Check vector columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND data_type = 'USER-DEFINED'
ORDER BY table_name, column_name;

-- Expected: 8 vector columns across tables