-- v5.1 Schema with PHASES table and PATH_WORKS junction
-- Drop existing tables to recreate with proper structure
DROP TABLE IF EXISTS patterns CASCADE;
DROP TABLE IF EXISTS tides CASCADE;
DROP TABLE IF EXISTS path_works CASCADE;
DROP TABLE IF EXISTS paths CASCADE;
DROP TABLE IF EXISTS works CASCADE;
DROP TABLE IF EXISTS phases CASCADE;

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- PHASES table - organizes development into logical phases
CREATE TABLE phases (
  phase_id VARCHAR PRIMARY KEY,
  what TEXT NOT NULL,
  scope TEXT NOT NULL,
  architecture TEXT NOT NULL,
  evolution_from VARCHAR,
  
  -- v4 template fields
  project JSONB,
  decisions JSONB,
  learnings JSONB,
  for_new_session JSONB,
  
  -- System fields
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (evolution_from) REFERENCES phases(phase_id)
);

-- WORKS table with v4 template fields and semantic vectors
CREATE TABLE works (
  work_id VARCHAR PRIMARY KEY DEFAULT 'work_' || extract(epoch from now())::text || '_' || substr(md5(random()::text), 1, 4),
  what TEXT NOT NULL,
  how JSONB NOT NULL,
  metrics JSONB NOT NULL,
  
  -- v4 template fields
  context JSONB NOT NULL DEFAULT '{}',
  knowledge JSONB NOT NULL DEFAULT '{}',
  learnings JSONB NOT NULL DEFAULT '{}',
  troubleshooting JSONB NOT NULL DEFAULT '{}',
  artifacts JSONB NOT NULL DEFAULT '{}',
  
  -- Vectors for semantic search (E5-large-v2 = 1024 dims)
  what_vector vector(1024),
  how_vector vector(1024),
  
  -- System fields
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PATHS table with phase reference and v4 template fields
CREATE TABLE paths (
  path_id VARCHAR PRIMARY KEY DEFAULT 'path_' || extract(epoch from now())::text || '_' || substr(md5(random()::text), 1, 4),
  phase_id VARCHAR NOT NULL REFERENCES phases(phase_id),
  what TEXT NOT NULL,
  metrics JSONB NOT NULL,
  
  -- v4 template fields
  project JSONB,
  decisions JSONB,
  learnings JSONB,
  for_new_session JSONB,
  
  -- Vector for semantic search
  what_vector vector(1024),
  
  -- Metadata
  proven BOOLEAN DEFAULT FALSE,
  version VARCHAR DEFAULT '1.0',
  created_at TIMESTAMP DEFAULT NOW()
);

-- PATH_WORKS junction table - many-to-many relationship
CREATE TABLE path_works (
  path_id VARCHAR NOT NULL REFERENCES paths(path_id) ON DELETE CASCADE,
  work_id VARCHAR NOT NULL REFERENCES works(work_id) ON DELETE CASCADE,
  sequence_order INTEGER NOT NULL,
  
  PRIMARY KEY (path_id, work_id)
);

-- TIDES table (execution tracking)
CREATE TABLE tides (
  tide_id VARCHAR PRIMARY KEY DEFAULT 'tide_' || extract(epoch from now())::text || '_' || substr(md5(random()::text), 1, 4),
  path_id VARCHAR REFERENCES paths(path_id),
  attempt INTEGER NOT NULL,
  
  -- Execution data
  execution JSONB NOT NULL,  -- {work_name: status}
  adaptations JSONB,          -- Changes from original
  metrics_achieved JSONB,     -- {metric: boolean}
  learnings TEXT,
  outcome VARCHAR CHECK (outcome IN ('success', 'partial', 'failed')),
  
  -- Vector for searching similar learnings
  learnings_vector vector(1024),
  
  -- Timestamps
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  
  UNIQUE(path_id, attempt)
);

-- PATTERNS table
CREATE TABLE patterns (
  pattern_id VARCHAR PRIMARY KEY DEFAULT 'pattern_' || extract(epoch from now())::text || '_' || substr(md5(random()::text), 1, 4),
  distilled_from JSONB NOT NULL,  -- Array of tide_ids
  common_sequence JSONB NOT NULL,
  proven_adaptations JSONB,
  typical_issues JSONB,
  success_metrics JSONB,
  
  -- Vector for pattern similarity
  pattern_vector vector(1024),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vector similarity indexes
CREATE INDEX works_what_vector_idx ON works USING ivfflat (what_vector vector_cosine_ops) WITH (lists = 100);
CREATE INDEX works_how_vector_idx ON works USING ivfflat (how_vector vector_cosine_ops) WITH (lists = 100);
CREATE INDEX paths_what_vector_idx ON paths USING ivfflat (what_vector vector_cosine_ops) WITH (lists = 100);
CREATE INDEX tides_learnings_vector_idx ON tides USING ivfflat (learnings_vector vector_cosine_ops) WITH (lists = 100);
CREATE INDEX patterns_vector_idx ON patterns USING ivfflat (pattern_vector vector_cosine_ops) WITH (lists = 100);

-- Insert initial PHASE_1_free phase
INSERT INTO phases (phase_id, what, scope, architecture, project, decisions)
VALUES (
  'PHASE_1_free',
  'Build KG4EPIC passive document store with free resources',
  'CRUD operations for EPIC-TIDE documents with semantic search',
  'Passive storage only - no pattern extraction or learning synthesis',
  '{"name": "KG4EPIC", "type": "Document Store"}'::jsonb,
  '{"database": "PostgreSQL + pgvector", "embeddings": "E5-large-v2", "api": "POST-only"}'::jsonb
);