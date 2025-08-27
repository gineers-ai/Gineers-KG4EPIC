# CONTRACT: CONTRACT_002_DATABASE_SCHEMA

## CONTRACT Metadata

```yaml
contract_id: "CONTRACT_002_DATABASE_SCHEMA"
contract_version: "1.0.0"
contract_type: "setup"
created_by: "Terminal-1-architect"
created_at: "2025-01-25"
parent_route: "ROUTE_GINEERS_KG_POC1_001"
```

## What To Build

```yaml
what: "Core EPIC-TIDE database schema for Gineers-KG4EPIC with three tables: contracts, routes, tides"
```

## How To Build

```yaml
how: |
  1. Connect to PostgreSQL container
  2. Create gineers_kg4epic database
  3. Create contracts table with core fields
  4. Create routes table with contract sequence array
  5. Create tides table with execution tracking
  6. Add foreign key relationships
  7. Create indexes for performance
  8. Verify all constraints work
```

## Evidence Required

```yaml
evidence_required:
  - "Three tables exist in gineers_kg4epic database"
  - "Foreign key from tides to routes enforced"
  - "Array type working for contract_sequence"
  - "JSONB type working for contracts_executed"
  - "Test insert into all three tables successful"
```

## Dependencies

```yaml
depends_on:
  - "CONTRACT_001_DOCKER_SETUP"  # Need PostgreSQL running
```

## Triggers Next

```yaml
triggers_next:
  - "CONTRACT_004_CONTRACT_CRUD"  # Can build CONTRACT APIs
  - "CONTRACT_005_ROUTE_CRUD"     # Can build ROUTE APIs
```

## Implementation Details

### Input
```yaml
input:
  - "PostgreSQL container running"
  - "Database superuser credentials"
  - "Connection on port 5432"
```

### Output
```yaml
output:
  - "Database: gineers_kg4epic"
  - "Table: contracts"
  - "Table: routes"
  - "Table: tides"
  - "Migration file: 001_epic_tide_core.sql"
```

### Tools/Technologies
```yaml
tools:
  - "PostgreSQL 15"
  - "psql CLI"
  - "SQL migrations"
```

## Validation

```yaml
validation_steps:
  - step: "Check tables exist"
    expected: |
      \dt should show:
      - contracts
      - routes
      - tides
      
  - step: "Insert test CONTRACT"
    expected: |
      INSERT INTO contracts (contract_id, what, how, evidence_required)
      VALUES ('TEST_001', 'Test', 'Test how', 'Test evidence');
      -- Should succeed
      
  - step: "Insert test ROUTE"
    expected: |
      INSERT INTO routes (route_id, goal, contract_sequence)
      VALUES ('ROUTE_TEST', 'Test goal', ARRAY['TEST_001']);
      -- Should succeed
      
  - step: "Insert test TIDE"
    expected: |
      INSERT INTO tides (tide_id, route_id, tide_number, outcome)
      VALUES ('TIDE_TEST_1', 'ROUTE_TEST', 1, 'partial');
      -- Should succeed with foreign key check
```

## Error Handling

```yaml
known_issues:
  - issue: "Database 'gineers_kg4epic' already exists"
    solution: "DROP DATABASE IF EXISTS before CREATE"
    
  - issue: "Permission denied for schema public"
    solution: "GRANT ALL ON SCHEMA public TO postgres"
    
  - issue: "JSONB not supported"
    solution: "Ensure PostgreSQL 9.4+ (we use 15)"
```

## Learning Preservation

```yaml
learnings:
  - "Use TEXT[] for contract_sequence, not junction table"
  - "JSONB better than JSON for contracts_executed"
  - "Add created_at with DEFAULT NOW() for history"
  - "Consider adding updated_at for audit trail"
```

## SQL Schema

```sql
-- Create database (for Gineers-KG4EPIC passive knowledge server)
CREATE DATABASE gineers_kg4epic;

-- Connect to database
\c gineers_kg4epic;

-- Create contracts table (atomic HOW TO BUILD WHAT units)
CREATE TABLE contracts (
    contract_id VARCHAR(255) PRIMARY KEY,
    what TEXT NOT NULL,                    -- What to build
    how TEXT NOT NULL,                     -- How to build it
    evidence_required TEXT NOT NULL,       -- Proof needed
    triggers_next VARCHAR(255),            -- Next CONTRACT(s)
    evidence_collected JSONB,              -- Actual evidence
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create routes table (sequences of CONTRACTs)
CREATE TABLE routes (
    route_id VARCHAR(255) PRIMARY KEY,
    goal TEXT NOT NULL,                    -- What ROUTE achieves
    contract_sequence TEXT[] NOT NULL,     -- Ordered CONTRACT IDs
    evidence_gates JSONB,                  -- Gates between stages
    proven BOOLEAN DEFAULT FALSE,          -- Is ROUTE proven?
    proven_by_tide VARCHAR(255),           -- Which TIDE proved it
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create tides table (execution attempts with learning)
CREATE TABLE tides (
    tide_id VARCHAR(255) PRIMARY KEY,
    route_id VARCHAR(255) REFERENCES routes(route_id),
    tide_number INTEGER NOT NULL,          -- Attempt number
    contracts_executed JSONB,              -- Execution tracking
    evidence_collected JSONB,              -- Evidence gathered
    outcome VARCHAR(50) CHECK (outcome IN ('success', 'partial', 'failed')),
    learnings TEXT,                        -- What we learned
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(route_id, tide_number)          -- One number per ROUTE
);

-- Create indexes for performance
CREATE INDEX idx_tides_route_id ON tides(route_id);
CREATE INDEX idx_routes_proven ON routes(proven);
CREATE INDEX idx_contracts_created ON contracts(created_at);

-- Note: This is minimal schema for PoC_1
-- Future PoCs will add: embeddings, search, distillation
```

---

*CONTRACT Status: pending*