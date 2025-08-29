-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- WORKS table with semantic vectors
CREATE TABLE works (
  work_id VARCHAR PRIMARY KEY DEFAULT 'work_' || extract(epoch from now())::text || '_' || substr(md5(random()::text), 1, 4),
  what TEXT NOT NULL,
  how JSONB NOT NULL,
  metrics JSONB NOT NULL,
  
  -- Vectors for semantic search (E5-large-v2 = 1024 dims)
  what_vector vector(1024),
  how_vector vector(1024),
  
  -- System fields
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PATHS table
CREATE TABLE paths (
  path_id VARCHAR PRIMARY KEY DEFAULT 'path_' || extract(epoch from now())::text || '_' || substr(md5(random()::text), 1, 4),
  what TEXT NOT NULL,
  works JSONB NOT NULL,  -- Array of work names
  metrics JSONB NOT NULL,
  
  -- Vector for semantic search
  what_vector vector(1024),
  
  -- Metadata
  proven BOOLEAN DEFAULT FALSE,
  version VARCHAR DEFAULT '1.0',
  created_at TIMESTAMP DEFAULT NOW()
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
CREATE INDEX paths_what_vector_idx ON paths USING ivfflat (what_vector vector_cosine_ops) WITH (lists = 100);
CREATE INDEX tides_learnings_vector_idx ON tides USING ivfflat (learnings_vector vector_cosine_ops) WITH (lists = 100);
CREATE INDEX patterns_vector_idx ON patterns USING ivfflat (pattern_vector vector_cosine_ops) WITH (lists = 100);