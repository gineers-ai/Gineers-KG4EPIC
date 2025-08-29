-- v8 Schema for KG4EPIC Passive Storage System
-- Phase 1: Pure document storage with MCP contract support

-- Drop legacy v5.1 tables
DROP TABLE IF EXISTS path_works CASCADE;
DROP TABLE IF EXISTS tides CASCADE;
DROP TABLE IF EXISTS paths CASCADE;
DROP TABLE IF EXISTS works CASCADE;
DROP TABLE IF EXISTS phases CASCADE;
DROP TABLE IF EXISTS patterns CASCADE;

-- Ensure pgvector extension exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- 1. BLUEPRINTS table (stores EPIC-TIDE blueprint documents)
CREATE TABLE blueprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    yaml_content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    embedding_name vector(1024),        -- E5 for light fields
    embedding_content vector(1536),     -- Ada-002 for heavy content
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. EXECUTIONS table (stores TIDE execution records)
CREATE TABLE executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blueprint_id UUID REFERENCES blueprints(id) ON DELETE CASCADE,
    tide_number INTEGER NOT NULL,
    status VARCHAR(20) CHECK (status IN ('in_progress', 'completed', 'failed', 'blocked')),
    content JSONB NOT NULL DEFAULT '{}',
    embedding_summary vector(1536),     -- Ada-002 for execution summary
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(blueprint_id, tide_number)
);

-- 3. EVIDENCE table (stores proof of work completion)
CREATE TABLE evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID REFERENCES executions(id) ON DELETE CASCADE,
    work_key VARCHAR(255) NOT NULL,
    evidence_type VARCHAR(50) NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    artifacts JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. PATTERNS table (stores reusable patterns extracted from executions)
CREATE TABLE patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem TEXT NOT NULL,
    solution TEXT NOT NULL,
    applicability_score FLOAT DEFAULT 0.0 CHECK (applicability_score >= 0 AND applicability_score <= 1),
    embedding_problem vector(1536),     -- Ada-002 for problem
    embedding_solution vector(1536),     -- Ada-002 for solution
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance

-- B-tree indexes for lookups
CREATE INDEX idx_blueprints_slug ON blueprints(slug);
CREATE INDEX idx_blueprints_created ON blueprints(created_at DESC);
CREATE INDEX idx_executions_blueprint ON executions(blueprint_id);
CREATE INDEX idx_executions_status ON executions(status);
CREATE INDEX idx_evidence_execution ON evidence(execution_id);
CREATE INDEX idx_evidence_work_key ON evidence(work_key);
CREATE INDEX idx_patterns_score ON patterns(applicability_score DESC);

-- IVFFlat indexes for vector similarity search
CREATE INDEX idx_blueprints_embedding_name ON blueprints 
    USING ivfflat (embedding_name vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_blueprints_embedding_content ON blueprints 
    USING ivfflat (embedding_content vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_executions_embedding ON executions 
    USING ivfflat (embedding_summary vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_patterns_embedding_problem ON patterns 
    USING ivfflat (embedding_problem vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_patterns_embedding_solution ON patterns 
    USING ivfflat (embedding_solution vector_cosine_ops) WITH (lists = 100);

-- GIN indexes for JSONB columns
CREATE INDEX idx_blueprints_metadata ON blueprints USING gin(metadata);
CREATE INDEX idx_executions_content ON executions USING gin(content);
CREATE INDEX idx_evidence_content ON evidence USING gin(content);
CREATE INDEX idx_evidence_artifacts ON evidence USING gin(artifacts);

-- GIN index for tags array
CREATE INDEX idx_blueprints_tags ON blueprints USING gin(tags);

-- Update trigger for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blueprints_updated_at BEFORE UPDATE ON blueprints 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_executions_updated_at BEFORE UPDATE ON executions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO epic_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO epic_user;

-- Summary
SELECT 'v8 Schema created successfully' as status;
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns 
        WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;