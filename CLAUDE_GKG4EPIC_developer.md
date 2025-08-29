# CLAUDE.md for Gineers-KG4EPIC Development Sessions

## ⚠️ CRITICAL UPDATE: v5.1 Structure Changes + Evidence-Driven

### What Changed (v5.1):
- **Folder structure** now follows proper PHASE→PATH→TIDE hierarchy
- **WORKs** are in shared pool at `BLUEPRINTs/works/`
- **PATH** is now at `phases/PHASE_1_free/paths/kg4epic-mvp-enriched.yml`
- **Database schema** updated with PHASES table and PATH_WORKS junction

### Fundamental Principle:
- **NO TIME ESTIMATES** - EPIC-TIDE is evidence-driven
- **Progress by EVIDENCE** - Either it works or it doesn't
- **Completion by CRITERIA** - Not by schedules or deadlines
- **Events drive coordination** - Not time-based milestones

### Your Mission:
Build the **KG4EPIC RESTful API server** using EPIC-TIDE **v5.1** methodology.

### Start Here:
```bash
cd /Users/inseokseo/Gineers-Projects/Gineers-KG4EPIC

# 1. Read the PHASE definition first (NEW in v5.1)
cat Docs/Gineers-KG4EPIC/BLUEPRINTs/phases/PHASE_1_free/PHASE_1_free.yml

# 2. Read the PATH under the PHASE (NEW location)
cat Docs/Gineers-KG4EPIC/BLUEPRINTs/phases/PHASE_1_free/paths/kg4epic-mvp-enriched.yml

# 3. Check if any TIDEs exist (NEW structure)
ls Docs/Gineers-KG4EPIC/EXECUTIONs/phases/PHASE_1_free/paths/kg4epic-mvp/

# 4. If no TIDEs, you're ready to start TIDE_1
```

## Project Overview

### What is KG4EPIC?
A **PASSIVE DOCUMENT STORE** for EPIC-TIDE methodology with:
- **PostgreSQL + pgvector** for semantic search
- **POST-only endpoints** for security
- **E5-large-v2 embeddings** (1024 dimensions)
- **Docker compose** stack named 'gineers-kg4epic'
- **Self-contained v4 documents** with embedded context
- **NO PATTERN EXTRACTION** (deferred to Gineers-ACC)
- **NO LEARNING SYNTHESIS** (deferred to Gineers-ACC)

## Current Status - PHASE_2 EXECUTION (v6)

### PHASE_2 MULTI-TIER EMBEDDINGS (IN PROGRESS)

#### Completed (4/20 works):
```yaml
prepare_ada002_integration: ✓ API key verified, connection tested
create_ada002_service: ✓ FastAPI service on port 8001
update_database_for_ada002: ✓ Migration applied, 5 tables updated
implement_dual_embedding_api: ✓ /v2/embed endpoints working
```

#### Architecture Update:
- **4-container stack** (postgres, embeddings, embeddings-ada002, api)
- **Multi-tier embeddings**: E5-large-v2 (1024d) + text-embedding-ada-002 (1536d)
- **Dual vector columns** in all tables
- **API v2 endpoints** for multi-tier operations

### TIDE_1 EXECUTION RESULTS (PHASE_1 COMPLETE)
**Status**: SUCCESS with gaps ⚠️
**Achievement**: Foundation deployed and running
**Major Gaps**: Testing, validation, semantic search

### TIDE_1 Completed Items:
1. ✅ Node.js/TypeScript project setup
2. ✅ Docker stack running (postgres + api)
3. ✅ v5.1 database schema fully deployed (6 tables)
4. ⚠️ API working with mock embeddings (ESM issue)

### TIDE_2 Ready WORKs (Validation PATH):
Location: `BLUEPRINTs/works/`
1. 🔴 `validate-database-schema-v5-1.yml` - Verify v5.1 compliance
2. 🔴 `validate-semantic-search-v5.yml` - Implement search endpoints
3. 🔴 `validate-integration-tests-v5.yml` - Create test suite
4. 🔴 `complete-docker-stack-v5.yml` - Full orchestration

### TIDE_2 PATH to Execute:
```yaml
PHASE: PHASE_1_free
PATH: phases/PHASE_1_free/paths/kg4epic-validation.yml
Purpose: Complete and validate TIDE_1 gaps
Works sequence (validation focus):
  - ../../../works/validate-database-schema-v5-1
  - ../../../works/validate-semantic-search-v5
  - ../../../works/validate-integration-tests-v5
  - ../../../works/complete-docker-stack-v5
```

## EPIC-TIDE v5.1 Execution Guide

### Step 1: Create Proper Directory Structure
```bash
# Create v5.1 execution structure
mkdir -p Docs/Gineers-KG4EPIC/EXECUTIONs/phases/PHASE_1_free/paths/kg4epic-mvp/TIDE_1
```

### Step 2: Start TIDE_1
Create: `Docs/Gineers-KG4EPIC/EXECUTIONs/phases/PHASE_1_free/paths/kg4epic-mvp/TIDE_1/tide.yml`
```yaml
TIDE:
  attempt: 1
  path_ref: kg4epic-mvp
  started: [timestamp]
  
  execution:
    setup-nodejs-project-v3-enriched: # Start here
    setup-docker-environment-v4: 
    design-database-schema-v4:
    implement-post-api-v4:
```

### Step 3: Execute Each WORK
For each WORK in sequence:

1. **Read the WORK file from shared pool** (v5.1 location):
   ```bash
   cat Docs/Gineers-KG4EPIC/BLUEPRINTs/works/[work-name].yml
   ```

2. **Check the sections**:
   - `context:` - Where to work, what's needed
   - `knowledge:` - Critical information
   - `artifacts:` - Actual code/configs to use
   - `troubleshooting:` - If something goes wrong

3. **Implement using artifacts**:
   - Copy code from `artifacts:` section
   - Follow the `how:` steps
   - Verify with `metrics:`

4. **Update TIDE execution**:
   ```yaml
   execution:
     work-name: complete  # or failed/blocked
   ```

### Step 3: Handle Failures
If a WORK fails:
1. Check `troubleshooting:` in the WORK file
2. Document the issue in TIDE `learnings:`
3. If can't fix, mark as failed and continue to TIDE_2

### Step 4: Complete TIDE
When all WORKs executed:
```yaml
outcome: success  # or partial/failed
learnings: |
  - What you discovered
  - What should be added to WORKs
```

### Step 5: Update Documents with Learnings
**This is critical for v4!** - Add your learnings back to the documents:

If you discovered something new:
1. Add to WORK's `learnings:` section
2. Add to WORK's `troubleshooting:` if it's an issue
3. Update PATH's `learnings:` for project-wide insights

## Key Technical Decisions

### PASSIVE STORAGE ARCHITECTURE (2025-01-28)
- **KG4EPIC**: Dumb, fast, reliable document store
- **Gineers-ACC**: Smart processing (separate system, build later)
- **No pattern extraction in KG4EPIC**
- **No learning synthesis in KG4EPIC**

### Security: POST-Only
- All endpoints use POST method
- No sensitive data in URLs
- API key in header: `x-api-key`

### Database: PostgreSQL + pgvector + v5.1 Schema
- Docker image: `pgvector/pgvector:pg15`
- Vector dimension: 1024 (E5-large-v2)
- **v5.1 CHANGES ALREADY IN design-database-schema-v4.yml**:
  - PHASES table added
  - PATH_WORKS junction table for many-to-many
  - v4 fields in all tables (context, knowledge, etc.)
- **IMPORTANT**: Run the v5.1 schema, not old versions!

### Docker Setup
- Stack name: `gineers-kg4epic`
- Postgres on port 5432
- API on port 3000
- Use service names in connection strings (not localhost)

### Embeddings
- Model: `intfloat/e5-large-v2`
- Use prefix `query:` for search embeddings
- Cache embeddings for performance

## Current Docker Stack Status (TIDE_1 Result)

### What's Running:
```bash
# Both containers operational
kg4epic-postgres: pgvector/pgvector:pg15 (port 5432) ✅
kg4epic-api: gineers-kg4epic-api (port 3000) ✅
```

### What Works:
- Database has all 6 v5.1 tables
- API responds to POST requests
- Authentication via x-api-key header
- Basic CRUD operations functional
- Mock embeddings generating vectors

### What Doesn't Work:
- Real E5-large-v2 embeddings (ESM module issue)
- Semantic search endpoints (not implemented)
- PATH creation with v5.1 junction table
- Health check endpoints

## Common Issues (Pre-documented)

### Issue 1: Port Conflicts
**Solution**: Check `setup-docker-environment-v4.yml` troubleshooting section

### Issue 2: pgvector Not Found
**Solution**: Must use `pgvector/pgvector:pg15` image, not standard postgres

### Issue 3: Connection Refused
**Solution**: In Docker, use `postgres` as host, not `localhost`

### Issue 4: Vector Dimension Mismatch
**Solution**: All vectors must be 1024 dimensions (E5-large-v2)

## File Locations (v5.1 Structure)

### Blueprints:
```
Docs/Gineers-KG4EPIC/BLUEPRINTs/
  phases/
    PHASE_1_free/
      PHASE_1_free.yml               # Phase definition
      paths/
        kg4epic-mvp-enriched.yml     # PATH (Start here!)
  works/                              # Shared pool
    setup-nodejs-project-v3-enriched.yml
    setup-docker-environment-v4.yml
    design-database-schema-v4.yml    # v5.1 schema!
    implement-post-api-v4.yml
```

### Your Work Goes Here:
```
/Users/inseokseo/Gineers-Projects/Gineers-KG4EPIC/
  src/           # API code
  docker-compose.yml
  package.json
  .env
```

### Track Execution Here (v5.1):
```
Docs/Gineers-KG4EPIC/EXECUTIONs/
  phases/
    PHASE_1_free/
      paths/
        kg4epic-mvp/
          TIDE_1/
            tide.yml  # Your TIDE tracking
```

## Critical Reminders

### 1. Use v4 Documents
Only use WORKs with `-v4` or `-v3-enriched` suffix. They have:
- Complete context
- Full implementation in artifacts
- Troubleshooting guides
- Accumulated learnings

### 2. Everything is Self-Contained
Each WORK has **everything** needed to execute it. No external lookups required.

### 3. Update Documents with Learnings
After execution, add learnings back to WORKs and PATH. This is how v4 documents improve.

### 4. Follow the PATH
Execute WORKs in sequence defined by the PATH. Check prerequisites in each WORK's `context:` section.

## Git Commits
```
{Detailed message about what was implemented}
Author: David Seo of Gineers.AI
```

## Questions to Ask Yourself

Before starting:
- [ ] Have I read kg4epic-mvp-enriched.yml?
- [ ] Do I understand the project goals?
- [ ] Have I checked for existing TIDEs?

For each WORK:
- [ ] Have I read the complete v4 WORK file?
- [ ] Am I using the artifacts section?
- [ ] Have I checked troubleshooting for known issues?

After execution:
- [ ] Have I updated the TIDE file?
- [ ] Have I documented learnings?
- [ ] Should I update the WORK with new knowledge?

## Next Actions for TIDE_2

1. ✅ Review TIDE_1 gaps (Supervisor report)
2. 🔴 Start TIDE_2 for kg4epic-validation PATH
3. 🔴 Execute validation WORKs in sequence
4. 🔴 Create evidence artifacts (screenshots, test results)
5. 🔴 Document learnings and update WORKs

## TIDE_1 Learnings to Apply in TIDE_2

### Technical Learnings:
- **ESM Module Issue**: @xenova/transformers needs separate service
- **Database**: v5.1 schema works, all 6 tables verified
- **Docker**: Both containers run successfully
- **pgvector**: Requires array format [n,n,n] not JSON

### Process Learnings:
- **Evidence Required**: Claims need proof (screenshots, logs)
- **Testing Parallel**: Tests should be created with features
- **Validation First**: Each WORK needs validation before next
- **Mock vs Real**: Mock embeddings work for testing

### What TIDE_2 Must Fix:
1. **Embeddings**: Create separate embedding service
2. **Tests**: Build comprehensive test suite
3. **Search**: Implement semantic search endpoints
4. **Evidence**: Generate validation artifacts

---
*This document guides development sessions through KG4EPIC implementation using EPIC-TIDE v4 methodology.*