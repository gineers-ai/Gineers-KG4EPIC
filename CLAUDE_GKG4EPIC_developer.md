# CLAUDE.md for Gineers-KG4EPIC Development Sessions - v8

## ⚠️ CRITICAL EXECUTION RULES

### EPIC-TIDE v8 Evidence-Driven Development:
1. **MUST create execution YAML** before starting implementation
2. **MUST update execution document** after each work completion
3. **MUST record evidence** (artifacts, logs, verification) for tracing
4. **MUST follow blueprint works** in dependency order

### Current Execution:
- **Blueprint**: `Docs/Gineers-KG4EPIC/v8/BLUEPRINTS/epic_tide_v8_phase_1_final.yml`
- **Execution**: `Docs/Gineers-KG4EPIC/v8/EXECUTIONS/execution_1.yml`
- **Status**: TIDE 1 in progress (2/16 works complete)

## 🚀 CRITICAL: v8 PHASE_1 - Passive Storage with MCP Contract

### Architecture Understanding:
```
Claude Code → MCP Server → KG4EPIC /api/tool → PostgreSQL
     ↓           ↓              ↓                ↓
Orchestrates   Bridge    MCP Contract      Database
```

### Your Mission:
Build **KG4EPIC** as a PASSIVE document storage system with MCP-compatible API.
- Single `/api/tool` endpoint (POST only)
- Internal routing based on 'tool' parameter
- MCP request/response format compliance
- No workflow logic, pure storage only

## Current Blueprint: v8 PHASE_1

### Start Here:
```bash
cd /Users/inseokseo/Gineers-Projects/Gineers-KG4EPIC

# Read the v8 PHASE_1 blueprint
cat Docs/Gineers-KG4EPIC/v8/BLUEPRINTS/epic_tide_v8_phase_1_final.yml

# Check MCP contract requirements
cat Docs/Gineers-KG4EPIC/API_CONTRACT_REQUEST_FOR_MCP.md
```

## v8 Database Schema (4 Tables)

### Tables to Create:
```sql
1. blueprints: id(uuid), slug, name, yaml_content, metadata, tags, 
               embedding_name(1024), embedding_content(1536), timestamps
               
2. executions: id(uuid), blueprint_id, tide_number, status, content,
               embedding_summary(1536), timestamps
               
3. evidence: id(uuid), execution_id, work_key, evidence_type, 
             content, artifacts, created_at
             
4. patterns: id(uuid), problem, solution, applicability_score,
             embedding_problem(1536), embedding_solution(1536),
             usage_count, created_at
```

## MCP Contract Implementation

### Request Format:
```json
{
  "tool": "blueprint-create",
  "arguments": {
    "slug": "...",
    "name": "...",
    "yaml_content": "..."
  }
}
```

### Response Format:
```json
{
  "success": true,
  "result": {
    "content": [
      {"type": "text", "text": "Operation successful"}
    ]
  }
}
```

## Implementation Works (16 Total)

### Database Foundation:
1. ✅ drop_legacy_schema - Remove v5.1 tables
2. ⬜ create_v8_schema - Deploy 4 new tables

### MCP API Implementation:
3. ⬜ setup_api_structure - Express with TypeScript
4. ⬜ implement_tool_router - Route tools to handlers
5. ⬜ implement_blueprint_tools - 5 blueprint operations
6. ⬜ implement_execution_tools - 4 execution operations
7. ⬜ implement_evidence_endpoints - 2 evidence operations
8. ⬜ implement_pattern_endpoints - 4 pattern operations

### Embedding Integration:
9. ⬜ integrate_embedding_services - Connect E5 & Ada-002
10. ⬜ implement_embedding_pipeline - Auto-generate on save

### Search & Optimization:
11. ⬜ implement_semantic_search - Cross-entity search
12. ⬜ optimize_search_performance - < 200ms latency
13. ⬜ standardize_responses - MCP format compliance

### Testing & Deployment:
14. ⬜ create_integration_tests - All endpoints
15. ⬜ validate_performance - Load testing
16. ⬜ deploy_complete_system - Docker Compose

## Existing Infrastructure to Keep

### What's Already Running:
```yaml
postgres: pgvector/pgvector:pg15 (port 5432)
embeddings-e5: Python FastAPI (port 8000) - E5-large-v2
embeddings-ada002: Python FastAPI (port 8001) - text-embedding-ada-002
api: Node.js/TypeScript (port 3000) - Needs rewrite for MCP
```

### What to Preserve:
- Docker Compose infrastructure
- E5 embeddings service (working, keep as-is)
- Ada-002 embeddings service (working, keep as-is)
- PostgreSQL container (rebuild with v8 schema)

## Key Technical Decisions

### API Design:
- Single `/api/tool` endpoint only
- POST method exclusively
- MCP contract format (not REST)
- Internal tool routing

### Embeddings Strategy:
- **Light fields** (E5-large-v2, 1024d): name, slug, tags, summary
- **Heavy fields** (Ada-002, 1536d): yaml_content, content, problem, solution

### Performance Requirements:
- Storage latency: < 100ms (P95)
- Retrieval latency: < 50ms (P95)
- Search latency: < 200ms (P95)

## Current Execution Status

### Phase 1 Works Progress:
```yaml
Database:
  drop_legacy_schema: ⬜ Not started
  create_v8_schema: ⬜ Not started

API:
  setup_api_structure: ⬜ Not started
  implement_tool_router: ⬜ Not started
  
Tools (18+ total):
  blueprint-*: ⬜ 5 operations
  execution-*: ⬜ 4 operations
  evidence-*: ⬜ 2 operations
  pattern-*: ⬜ 4 operations
  utility: ⬜ 3 operations
```

## Next Actions

1. **Drop legacy v5.1 schema** (backup first if needed)
2. **Create v8 schema** with 4 tables
3. **Set up API** with single /api/tool endpoint
4. **Implement tool router** for internal dispatch
5. **Add MCP tools** one by one

## Common Commands

### Database Operations:
```bash
# Connect to database
docker exec -it kg4epic-postgres psql -U postgres -d kg4epic

# Check current tables
\dt

# Drop old tables (careful!)
DROP TABLE IF EXISTS phases, paths, tides, works, path_works CASCADE;
```

### API Development:
```bash
# Start development
npm run dev

# Test endpoint
curl -X POST http://localhost:3000/api/tool \
  -H "Content-Type: application/json" \
  -H "x-api-key: test-key" \
  -d '{"tool": "health-check", "arguments": {}}'
```

### Docker Operations:
```bash
# View running containers
docker ps

# Check logs
docker logs kg4epic-api -f

# Rebuild API container
docker-compose up -d --build api
```

## Git Commits
```
{Detailed message about v8 implementation}
Author: David Seo of Gineers.AI
```

## Critical Reminders

### What KG4EPIC IS:
- ✅ Passive document storage
- ✅ MCP contract implementation
- ✅ Single /api/tool endpoint
- ✅ Internal tool routing
- ✅ Dual embedding strategy

### What KG4EPIC is NOT:
- ❌ MCP Server (that's separate)
- ❌ Workflow orchestrator
- ❌ Event handler
- ❌ State machine
- ❌ Autonomous agent

---
*This document guides v8 PHASE_1 implementation of KG4EPIC passive storage system.*