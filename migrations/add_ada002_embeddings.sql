-- Migration: Add Ada-002 embedding columns to all tables
-- Model: text-embedding-ada-002 (1536 dimensions)
-- Date: 2025-01-29
-- Phase: PHASE_2 Multi-tier Embeddings

-- 1. blueprints table
ALTER TABLE blueprints 
ADD COLUMN IF NOT EXISTS embedding_ada002 vector(1536);

CREATE INDEX IF NOT EXISTS idx_blueprints_embedding_ada002 
ON blueprints USING ivfflat (embedding_ada002 vector_cosine_ops)
WITH (lists = 100);

-- 2. executions table  
ALTER TABLE executions
ADD COLUMN IF NOT EXISTS embedding_ada002 vector(1536);

CREATE INDEX IF NOT EXISTS idx_executions_embedding_ada002
ON executions USING ivfflat (embedding_ada002 vector_cosine_ops)
WITH (lists = 100);

-- 3. works table
ALTER TABLE works
ADD COLUMN IF NOT EXISTS embedding_ada002 vector(1536);

CREATE INDEX IF NOT EXISTS idx_works_embedding_ada002
ON works USING ivfflat (embedding_ada002 vector_cosine_ops)
WITH (lists = 100);

-- 4. events table
ALTER TABLE events
ADD COLUMN IF NOT EXISTS embedding_ada002 vector(1536);

CREATE INDEX IF NOT EXISTS idx_events_embedding_ada002
ON events USING ivfflat (embedding_ada002 vector_cosine_ops)
WITH (lists = 100);

-- 5. learnings table
ALTER TABLE learnings
ADD COLUMN IF NOT EXISTS embedding_ada002 vector(1536);

CREATE INDEX IF NOT EXISTS idx_learnings_embedding_ada002
ON learnings USING ivfflat (embedding_ada002 vector_cosine_ops)
WITH (lists = 100);

-- 6. patterns table
ALTER TABLE patterns
ADD COLUMN IF NOT EXISTS embedding_ada002 vector(1536);

CREATE INDEX IF NOT EXISTS idx_patterns_embedding_ada002
ON patterns USING ivfflat (embedding_ada002 vector_cosine_ops)
WITH (lists = 100);

-- Verify migration
SELECT 
    table_name,
    column_name,
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_schema = 'public'
    AND column_name LIKE '%ada002%'
ORDER BY table_name;