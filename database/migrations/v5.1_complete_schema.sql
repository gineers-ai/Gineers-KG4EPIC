-- v5.1 Complete Schema Migration for KG4EPIC
-- WARNING: This drops and recreates all tables to ensure v5.1 compliance

BEGIN;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS patterns CASCADE;
DROP TABLE IF EXISTS path_works CASCADE;
DROP TABLE IF EXISTS tides CASCADE;
DROP TABLE IF EXISTS works CASCADE;
DROP TABLE IF EXISTS paths CASCADE;
DROP TABLE IF EXISTS phases CASCADE;

-- Ensure pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PHASES table (root of hierarchy)
CREATE TABLE phases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phase_id VARCHAR(100) UNIQUE NOT NULL,
    what TEXT NOT NULL,
    version VARCHAR(10) NOT NULL DEFAULT '1.0',
    
    -- Phase-level context
    strategy JSONB,
    business JSONB,
    technical JSONB,
    
    -- Success and status
    success_criteria JSONB,
    status VARCHAR(50) DEFAULT 'planning',
    
    -- Learnings and patterns
    learnings JSONB,
    patterns_harvested JSONB,
    
    -- System fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PATHS table (children of phases)
CREATE TABLE paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path_id VARCHAR(100) UNIQUE NOT NULL,
    phase_id UUID REFERENCES phases(id) ON DELETE CASCADE,
    what TEXT NOT NULL,
    version VARCHAR(10) NOT NULL DEFAULT '1.0',
    
    -- Path context
    project JSONB,
    decisions JSONB,
    metrics JSONB,
    
    -- Status tracking
    status VARCHAR(50) DEFAULT 'pending',
    current_tide INTEGER DEFAULT 0,
    
    -- System fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. WORKS table (reusable components)
CREATE TABLE works (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_id VARCHAR(100) UNIQUE NOT NULL,
    what TEXT NOT NULL,
    why TEXT,
    how TEXT,
    version VARCHAR(10) NOT NULL DEFAULT '1.0',
    
    -- v4 template fields
    context JSONB,
    knowledge JSONB,
    artifacts JSONB,
    troubleshooting JSONB,
    learnings JSONB,
    
    -- Semantic fields with vectors for E5-large-v2 (1024 dimensions)
    what_embedding vector(1024),
    why_embedding vector(1024),
    knowledge_embedding vector(1024),
    
    -- System fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. PATH_WORKS junction table (many-to-many)
CREATE TABLE path_works (
    path_id UUID REFERENCES paths(id) ON DELETE CASCADE,
    work_id UUID REFERENCES works(id) ON DELETE CASCADE,
    sequence INTEGER NOT NULL,
    purpose TEXT,
    PRIMARY KEY (path_id, work_id)
);

-- 5. TIDES table (execution attempts)
CREATE TABLE tides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tide_number INTEGER NOT NULL,
    path_id UUID REFERENCES paths(id) ON DELETE CASCADE,
    
    -- Execution tracking
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    outcome VARCHAR(50),
    
    -- Context and results
    context JSONB,
    decisions JSONB,
    execution JSONB,
    learnings JSONB,
    troubleshooting JSONB,
    
    -- Unique constraint
    UNIQUE(path_id, tide_number)
);

-- 6. PATTERNS table (extracted knowledge)
CREATE TABLE patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pattern_name VARCHAR(200) NOT NULL,
    source_tide_id UUID REFERENCES tides(id),
    
    -- Pattern details
    pattern_type VARCHAR(50),
    problem_category VARCHAR(100),
    solution JSONB,
    evidence JSONB,
    reusability_score INTEGER CHECK (reusability_score >= 1 AND reusability_score <= 10),
    
    -- Semantic search with E5-large-v2 embeddings
    pattern_embedding vector(1024),
    
    -- System fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_phases_status ON phases(status);
CREATE INDEX idx_phases_phase_id ON phases(phase_id);
CREATE INDEX idx_paths_phase ON paths(phase_id);
CREATE INDEX idx_paths_status ON paths(status);
CREATE INDEX idx_paths_path_id ON paths(path_id);
CREATE INDEX idx_works_work_id ON works(work_id);
CREATE INDEX idx_tides_path ON tides(path_id);
CREATE INDEX idx_tides_outcome ON tides(outcome);
CREATE INDEX idx_patterns_type ON patterns(pattern_type);
CREATE INDEX idx_patterns_category ON patterns(problem_category);

-- Create indexes for vector similarity search
CREATE INDEX idx_works_what_embedding ON works USING ivfflat (what_embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_works_knowledge_embedding ON works USING ivfflat (knowledge_embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_patterns_embedding ON patterns USING ivfflat (pattern_embedding vector_cosine_ops) WITH (lists = 100);

-- Create update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_phases_updated_at BEFORE UPDATE ON phases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_paths_updated_at BEFORE UPDATE ON paths FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_works_updated_at BEFORE UPDATE ON works FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patterns_updated_at BEFORE UPDATE ON patterns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Validation Section
-- Run these after migration to confirm success

-- 1. Check all tables exist (should return 6 rows)
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('phases', 'paths', 'works', 'path_works', 'tides', 'patterns')
ORDER BY table_name;

-- 2. Check vector columns (should return 4 rows)
SELECT table_name, column_name, udt_name
FROM information_schema.columns 
WHERE table_schema = 'public'
AND udt_name = 'vector'
ORDER BY table_name, column_name;

-- 3. Check foreign key relationships (should return 6 rows)
SELECT 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table,
  ccu.column_name AS foreign_column 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name;