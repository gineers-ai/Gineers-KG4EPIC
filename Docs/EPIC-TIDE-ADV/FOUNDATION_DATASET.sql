-- EPIC-TIDE v5.1 Foundation Dataset
-- With corrected PHASE hierarchy and shared WORK pool

-- ============================================
-- 1. PHASES Table - Scope boundaries (NEW in v5)
-- ============================================

CREATE TABLE IF NOT EXISTS phases (
  phase_id VARCHAR PRIMARY KEY,
  what TEXT NOT NULL,
  scope JSONB NOT NULL,
  architecture JSONB NOT NULL,
  evolution_from VARCHAR,  -- Previous phase
  success_criteria JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. WORKS Table - Shared pool (v5.1 clarification)
-- ============================================

CREATE TABLE IF NOT EXISTS works (
  work_id VARCHAR PRIMARY KEY,
  what TEXT NOT NULL,
  how JSONB NOT NULL,
  metrics JSONB NOT NULL,
  -- v4 template fields
  context JSONB,        -- Environment, prerequisites, outputs
  knowledge JSONB,      -- Critical information
  learnings JSONB,      -- From executions
  troubleshooting JSONB,-- Known issues
  artifacts JSONB,      -- Implementation code
  version VARCHAR(10),  -- v5.1: Version tracking
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Simple, reusable work units
INSERT INTO works (work_id, what, how, metrics) VALUES 
-- Basic setup work
('setup-env', 
 'Setup development environment',
 '["Install dependencies", "Configure settings", "Test connection"]',
 '["Environment ready", "Tests pass"]'),

-- Database work
('create-db',
 'Create database',
 '["Create schema", "Add tables", "Set indexes"]',
 '["Database exists", "Tables created"]'),

-- API work  
('create-api',
 'Create REST API',
 '["Setup routes", "Add handlers", "Connect to DB"]',
 '["API responds", "CRUD works"]'),

-- Testing work
('add-tests',
 'Add test suite',
 '["Write unit tests", "Setup test DB", "Add CI"]',
 '["Tests run", "Coverage >80%"]');

-- ============================================
-- 3. PATHS Table - With PHASE relationship
-- ============================================

CREATE TABLE IF NOT EXISTS paths (
  path_id VARCHAR PRIMARY KEY,
  phase_id VARCHAR REFERENCES phases(phase_id),  -- v5: Phase relationship
  what TEXT NOT NULL,
  metrics JSONB NOT NULL,
  -- v4 template fields
  project JSONB,        -- Project context
  decisions JSONB,      -- Architectural choices
  learnings JSONB,      -- Accumulated wisdom
  for_new_session TEXT, -- Bootstrap instructions
  proven BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3.1 PATH_WORKS Junction Table (NEW in v5.1)
-- ============================================

CREATE TABLE IF NOT EXISTS path_works (
  path_id VARCHAR REFERENCES paths(path_id),
  work_id VARCHAR REFERENCES works(work_id),
  sequence INTEGER NOT NULL,
  purpose TEXT,         -- Why this work is used
  adaptations JSONB,    -- Path-specific adaptations
  PRIMARY KEY (path_id, work_id)
);

-- Basic path without works (v5.1: works linked via junction table)
INSERT INTO paths (path_id, phase_id, what, metrics, proven) VALUES
-- Simple web API path
('api-v1',
 'phase_1_free',
 'Build user API',
 '["API complete", "Tests pass", "Deployed"]',
 FALSE),

-- Proven path (after successful TIDE)
('api-proven',
 'phase_1_free',
 'Proven API build', 
 '["API complete", "Tests pass", "Deployed"]',
 TRUE);

-- Link works to paths via junction table
INSERT INTO path_works (path_id, work_id, sequence, purpose) VALUES
('api-v1', 'setup-env', 1, 'Initialize development environment'),
('api-v1', 'create-db', 2, 'Setup database infrastructure'),
('api-v1', 'create-api', 3, 'Implement REST endpoints'),
('api-v1', 'add-tests', 4, 'Add test coverage'),
('api-proven', 'setup-env', 1, 'Initialize development environment'),
('api-proven', 'create-db', 2, 'Setup database infrastructure'),
('api-proven', 'create-api', 3, 'Implement REST endpoints'),
('api-proven', 'add-tests', 4, 'Add test coverage');

-- ============================================
-- 4. TIDES Table - Execution tracking (unchanged)
-- ============================================

CREATE TABLE IF NOT EXISTS tides (
  tide_id VARCHAR PRIMARY KEY,
  path_id VARCHAR REFERENCES paths(path_id),
  attempt INTEGER NOT NULL,
  execution JSONB NOT NULL,
  adaptations JSONB,
  metrics_achieved JSONB,
  learnings TEXT,
  outcome VARCHAR CHECK (outcome IN ('success', 'partial', 'failed')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(path_id, attempt)
);

-- First attempt - partial success
INSERT INTO tides (tide_id, path_id, attempt, execution, adaptations, metrics_achieved, learnings, outcome) VALUES
('tide-api-1',
 'api-v1',
 1,
 '{
   "setup-env": "done",
   "create-db": "done", 
   "create-api": "failed",
   "add-tests": "blocked"
 }',
 NULL,  -- No adaptations on first attempt
 '{
   "API complete": false,
   "Tests pass": false
 }',
 'Missing auth middleware',
 'partial');

-- Second attempt - success with adaptation
INSERT INTO tides (tide_id, path_id, attempt, execution, adaptations, metrics_achieved, learnings, outcome) VALUES
('tide-api-2',
 'api-v1', 
 2,
 '{
   "setup-env": "reused",
   "create-db": "reused",
   "add-auth": "done",
   "create-api": "done",
   "add-tests": "done"
 }',
 '{
   "added": ["add-auth"],
   "position": "before create-api"
 }',
 '{
   "API complete": true,
   "Tests pass": true,
   "Deployed": true
 }',
 'Auth must come before API endpoints',
 'success');

-- ============================================
-- 5. PATTERNS Table - Distilled knowledge (enhanced)
-- ============================================

CREATE TABLE IF NOT EXISTS patterns (
  pattern_id VARCHAR PRIMARY KEY,
  distilled_from JSONB NOT NULL,
  common_sequence JSONB NOT NULL,
  proven_adaptations JSONB,
  typical_issues JSONB,
  success_metrics JSONB,
  application_contexts JSONB,  -- Where pattern applies
  effectiveness_score FLOAT,    -- Pattern success rate
  created_at TIMESTAMP DEFAULT NOW()
);

-- Simple pattern from successful TIDEs
INSERT INTO patterns (pattern_id, distilled_from, common_sequence, proven_adaptations, typical_issues, success_metrics) VALUES
('rest-api-pattern',
 '["tide-api-2", "tide-blog-2", "tide-shop-3"]',
 '["setup-env", "create-db", "add-auth", "create-api", "add-tests"]',
 '{
   "auth_before_api": {
     "success_rate": 0.9,
     "description": "Always add auth before API"
   }
 }',
 '{
   "missing_auth": 0.7,
   "db_connection": 0.3
 }',
 '{
   "avg_attempts": 2,
   "success_rate": 0.85
 }');

-- ============================================
-- Sample PHASE Data (NEW in v5)
-- ============================================

INSERT INTO phases (phase_id, what, scope, architecture, evolution_from, success_criteria) VALUES
('phase_1_free',
 'Basic document storage with E5',
 '{"apis": ["CRUD"], "embeddings": ["E5-large-v2"], "cost": "FREE"}',
 '{"storage": "PostgreSQL+pgvector", "api": "POST-only", "dims": 1024}',
 NULL,
 '{"working_crud": true, "semantic_search": true}'),
 
('phase_2_enhanced',
 'Add content embeddings',
 '{"apis": ["CRUD", "batch"], "embeddings": ["E5", "ada-002"], "cost": "$"}',
 '{"storage": "Multi-vector columns", "api": "POST-only", "dims": [1024, 1536]}',
 'phase_1_free',
 '{"long_content_search": true, "hybrid_search": true}');

-- ============================================
-- Query Examples (Enhanced for v5.1)
-- ============================================

-- Find phases and their paths (v5.1: proper hierarchy)
SELECT 
  ph.phase_id, 
  ph.what as phase_what,
  pa.path_id,
  pa.what as path_what
FROM phases ph
LEFT JOIN paths pa ON ph.phase_id = pa.phase_id;

-- Get works for a path (v5.1: via junction table)
SELECT 
  p.path_id,
  pw.sequence,
  w.work_id,
  w.what,
  pw.purpose
FROM paths p
JOIN path_works pw ON p.path_id = pw.path_id
JOIN works w ON pw.work_id = w.work_id
WHERE p.path_id = 'api-v1'
ORDER BY pw.sequence;

-- Track phase evolution
SELECT 
  phase_id,
  what,
  scope->>'cost' as cost_tier,
  evolution_from
FROM phases
ORDER BY created_at;

-- Find successful execution
SELECT * FROM tides WHERE outcome = 'success';

-- Get proven paths
SELECT * FROM paths WHERE proven = TRUE;

-- Find common failures
SELECT learnings, COUNT(*) 
FROM tides 
WHERE outcome != 'success' 
GROUP BY learnings;

-- Get pattern details
SELECT 
  pattern_id,
  common_sequence,
  effectiveness_score,
  proven_adaptations->>'auth_before_api' as key_adaptation
FROM patterns;