# PoC_1: EPIC-TIDE Core Implementation for Gineers-KG4EPIC

## PoC Metadata

```yaml
poc_id: "POC_1_EPIC_TIDE_CORE"
poc_name: "EPIC-TIDE Core: CONTRACT + ROUTE + TIDE"
business_value: "Knowledge execution and learning system"
route_id: "ROUTE_EPIC_TIDE_CORE_001"
execution_mode: "evidence-driven"
created_by: "Terminal-1-architect"
created_at: "2025-01-25"
```

## Core Takeaway Focus

**What This PoC Proves**: 
- **CONTRACT**: Atomic "HOW TO BUILD WHAT" units work
- **ROUTE**: Sequences of CONTRACTs achieve goals
- **TIDE**: Execution attempts are tracked with learning
- **Evidence-Driven**: Progress triggered by proof, not time

**What We're NOT Building Yet**:
- ❌ Embeddings/Search (adds complexity)
- ❌ Distillation (needs multiple projects first)
- ❌ WHISTLEs (needs patterns first)
- ❌ Advanced UI (core first)

## CONTRACT Sequence

### Stage 1: Database Foundation

#### CONTRACT_001: Setup PostgreSQL
```yaml
what: "PostgreSQL database for EPIC-TIDE"
how: "Install PostgreSQL 15+, create gineers_kg4epic database"
evidence_required: "Database running and accepting connections"
triggers_next: [CONTRACT_002]
```

#### CONTRACT_002: Create Core Schema
```yaml
what: "Three core tables: contracts, routes, tides"
how: |
  CREATE TABLE contracts (
    contract_id VARCHAR PRIMARY KEY,
    what TEXT NOT NULL,
    how TEXT NOT NULL,
    evidence_required TEXT NOT NULL,
    triggers_next VARCHAR
  );
  
  CREATE TABLE routes (
    route_id VARCHAR PRIMARY KEY,
    goal TEXT NOT NULL,
    contract_sequence TEXT[] NOT NULL,
    proven BOOLEAN DEFAULT FALSE
  );
  
  CREATE TABLE tides (
    tide_id VARCHAR PRIMARY KEY,
    route_id VARCHAR REFERENCES routes(route_id),
    tide_number INTEGER NOT NULL,
    contracts_executed JSONB,
    outcome VARCHAR,
    learnings TEXT
  );
evidence_required: "All three tables created with relationships"
depends_on: [CONTRACT_001]
triggers_next: [CONTRACT_003, CONTRACT_004]
```

### Stage 2: Core APIs

#### CONTRACT_003: API Structure
```yaml
what: "Modular TypeScript/Express API structure with POST-only mutations"
how: |
  Create src/ directory structure
  Set up Express with security middleware
  Implement POST-only mutation pattern
  Create health check endpoint
evidence_required: "Server running with POST-only security"
depends_on: [CONTRACT_001]
triggers_next: [CONTRACT_004, CONTRACT_005]
```

#### CONTRACT_004: CONTRACT CRUD APIs
```yaml
what: "Create, Read, Update, Delete for CONTRACTs"
how: |
  POST /api/contracts/create - Create CONTRACT
  GET /api/contracts/:id - Read CONTRACT
  POST /api/contracts/update - Update CONTRACT
  POST /api/contracts/delete - Soft delete CONTRACT
evidence_required: "All CRUD operations working with test data"
depends_on: [CONTRACT_002, CONTRACT_003]
triggers_next: [CONTRACT_005]
```

#### CONTRACT_005: ROUTE CRUD APIs
```yaml
what: "CRUD operations for ROUTEs"
how: |
  POST /api/routes/create - Create ROUTE with sequence
  GET /api/routes/:id - Read ROUTE with CONTRACTs
  POST /api/routes/update - Update ROUTE
  POST /api/routes/delete - Soft delete ROUTE
evidence_required: "ROUTE with 3+ CONTRACTs created and retrieved"
depends_on: [CONTRACT_002, CONTRACT_004]
triggers_next: [CONTRACT_006]
```

#### CONTRACT_006: TIDE Execution APIs
```yaml
what: "TIDE creation and tracking"
how: |
  POST /api/tides/create - New TIDE for ROUTE
  POST /api/tides/execute - Record CONTRACT execution
  GET /api/tides/:route_id - Get all TIDEs for ROUTE
evidence_required: "TIDE tracks CONTRACT execution with outcomes"
depends_on: [CONTRACT_005]
triggers_next: [CONTRACT_007]
```

### Stage 3: Validation

#### CONTRACT_007: Test ROUTE Execution
```yaml
what: "Execute a complete ROUTE through TIDEs"
how: |
  1. Create ROUTE "Build Hello World API"
  2. Add 3 CONTRACTs (setup, implement, test)
  3. Execute TIDE_1, simulate partial success
  4. Execute TIDE_2, achieve full success
evidence_required: "ROUTE proven after 2 TIDEs with learning captured"
depends_on: [CONTRACT_006]
triggers_next: [CONTRACT_008]
```

#### CONTRACT_008: Learning Extraction
```yaml
what: "Extract learnings from TIDE history and document PoC success"
how: |
  - Query failed CONTRACTs from TIDE_1
  - Show how TIDE_2 fixed the issues
  - Generate learning report with patterns
  - Document all evidence collected
evidence_required: "Learning extraction working and PoC completion proven"
depends_on: [CONTRACT_007]
triggers_next: [POC_COMPLETE]
```

## Execution Strategy

```yaml
execution_type: "evidence-driven"
linear_flow: "Each CONTRACT builds on previous"

event_triggers:
  CONTRACT_001_COMPLETE: "Database ready → Create schema"
  CONTRACT_002_COMPLETE: "Schema ready → Build APIs"
  CONTRACT_005_COMPLETE: "APIs ready → Test execution"
  CONTRACT_006_COMPLETE: "Execution works → Extract learnings"
  CONTRACT_008_COMPLETE: "Evidence collected → POC COMPLETE"
```

## Evidence Gates

```yaml
GATE_1_DATABASE:
  required_evidence:
    - "PostgreSQL running on port 5432"
    - "Connection string working"
  unlocks: "Schema creation"

GATE_2_SCHEMA:
  required_evidence:
    - "contracts table exists"
    - "routes table exists"
    - "tides table exists"
  unlocks: "API implementation"

GATE_3_APIS:
  required_evidence:
    - "CONTRACT created and retrieved"
    - "ROUTE created with CONTRACTs"
    - "TIDE created for ROUTE"
  unlocks: "Execution testing"

GATE_4_EXECUTION:
  required_evidence:
    - "TIDE_1 partial completion recorded"
    - "TIDE_2 full success achieved"
    - "Learnings extracted from history"
  unlocks: "PoC completion"
```

## Success Metrics

```yaml
must_pass:
  - Three core tables created (contracts, routes, tides)
  - CONTRACT CRUD operational
  - ROUTE with sequence working
  - TIDE execution tracking
  - Learning extraction from failures

core_demonstration:
  - Show TIDE_1 with partial success
  - Show TIDE_2 fixing the issues
  - Prove learning preservation
```

## Dependencies

```yaml
minimal_technical:
  - PostgreSQL 15+
  - Node.js 18+
  - TypeScript
  - Express.js

knowledge_required:
  - CONTRACT = HOW TO BUILD WHAT
  - ROUTE = SEQUENCE of CONTRACTs
  - TIDE = ACTUALLY TRIED ROUTE
```

## Risk Mitigations

```yaml
risks:
  schema_confusion:
    risk: "Developers confuse concepts"
    mitigation: "Clear examples in test execution"
    evidence: "Developer can explain CONTRACT vs ROUTE vs TIDE"
  
  tide_complexity:
    risk: "TIDE seems redundant"
    mitigation: "Demo shows learning from TIDE_1 to TIDE_2"
    evidence: "Clear value of history preservation"
```

## What Comes After PoC_1

```yaml
POC_2_TRIGGER:
  when: "Core proven (CONTRACT + ROUTE + TIDE working)"
  what: "Add semantic search with embeddings"
  why: "Enable pattern discovery across CONTRACTs"

POC_3_TRIGGER:
  when: "Multiple projects completed"
  what: "Add distillation (DISTILLED-CONTRACT)"
  why: "Extract reusable patterns"

POC_4_TRIGGER:
  when: "Patterns identified"
  what: "Add WHISTLE orchestration"
  why: "Rapid execution of proven patterns"
```

## Evidence Collection Plan

```yaml
evidence_types:
  database:
    - Screenshot: Three tables created
    - Query: SELECT count(*) from each table
  
  api_logs:
    - CONTRACT created: POST /api/contracts response
    - ROUTE created: POST /api/routes response  
    - TIDE executed: POST /api/tides response
  
  execution_demo:
    - TIDE_1: Show partial success
    - TIDE_2: Show complete success
    - Learning: Extract what was fixed
```

## Example Test Scenario

```yaml
TEST_ROUTE: "Build Hello World API"
  
CONTRACT_1_SETUP:
  what: "Setup Express server"
  how: "npm init, install express"
  evidence_required: "Server starts on port 3000"

CONTRACT_2_IMPLEMENT:
  what: "Create /hello endpoint"
  how: "app.get('/hello', ...)"
  evidence_required: "Returns 'Hello World'"

CONTRACT_3_TEST:
  what: "Test the endpoint"
  how: "curl localhost:3000/hello"
  evidence_required: "200 OK with 'Hello World'"

TIDE_1_SIMULATION:
  CONTRACT_1: ✅ Complete
  CONTRACT_2: ❌ Failed (typo in route)
  CONTRACT_3: ⏸️ Blocked
  learning: "Route was '/helo' not '/hello'"

TIDE_2_EXECUTION:
  CONTRACT_1: ✅ Reused
  CONTRACT_2: ✅ Fixed typo
  CONTRACT_3: ✅ Complete
  outcome: "ROUTE PROVEN"
```

---

*PoC_1 Focus: Prove that CONTRACT + ROUTE + TIDE is the minimal viable knowledge execution system*