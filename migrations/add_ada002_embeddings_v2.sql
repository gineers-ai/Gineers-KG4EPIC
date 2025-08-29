-- Migration: Add Ada-002 embedding columns to v5.1 schema tables
-- Model: text-embedding-ada-002 (1536 dimensions)
-- Date: 2025-01-29
-- Phase: PHASE_2 Multi-tier Embeddings

-- 1. phases table
ALTER TABLE phases 
ADD COLUMN IF NOT EXISTS embedding_ada002 vector(1536);

CREATE INDEX IF NOT EXISTS idx_phases_embedding_ada002 
ON phases USING ivfflat (embedding_ada002 vector_cosine_ops)
WITH (lists = 100);

-- 2. paths table  
ALTER TABLE paths
ADD COLUMN IF NOT EXISTS embedding_ada002 vector(1536);

CREATE INDEX IF NOT EXISTS idx_paths_embedding_ada002
ON paths USING ivfflat (embedding_ada002 vector_cosine_ops)
WITH (lists = 100);

-- 3. tides table
ALTER TABLE tides
ADD COLUMN IF NOT EXISTS embedding_ada002 vector(1536);

CREATE INDEX IF NOT EXISTS idx_tides_embedding_ada002
ON tides USING ivfflat (embedding_ada002 vector_cosine_ops)
WITH (lists = 100);

-- 4. path_works table (junction table, may not need embeddings)
-- Skipping as this is a relationship table

-- 5. works table (already done)
-- Already has embedding_ada002 column

-- 6. patterns table (already done)
-- Already has embedding_ada002 column

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

-- Count vector columns per table
SELECT 
    table_name,
    COUNT(*) as vector_columns
FROM information_schema.columns
WHERE table_schema = 'public'
    AND udt_name = 'vector'
GROUP BY table_name
ORDER BY table_name;