# CLAUDE.md - Multi-Session Dispatcher

## Choose Your Role

### 🏗️ Terminal 1: Architect (Methodology)
**Focus**: EPIC-TIDE methodology improvement  
**Start**: `cat CLAUDE_methodology_creator.md`  
**Docs**: `Docs/EPIC-TIDE-ADV/`

### 👨‍💻 Terminal 2: Developer (KG4EPIC)
**Focus**: Building KG4EPIC API server  
**Start**: `cat CLAUDE_GKG4EPIC_developer.md`  
**v5.1 PATH**: `Docs/Gineers-KG4EPIC/BLUEPRINTs/phases/PHASE_1_free/paths/kg4epic-mvp-enriched.yml`
**⚠️ CRITICAL**: Structure changed - read updated developer guide!

### 🔍 Terminal 3: Supervisor (Architecture Review)
**Focus**: System architecture & EPIC-TIDE alignment  
**Start**: `cat CLAUDE_GKG4EPIC_supervisor.md`  
**Reports**: `Docs/Monitoring-Gineers-KG4EPIC/`

## Project Status Dashboard

### KG4EPIC Development
```yaml
PHASE_2_enhanced: IN PROGRESS 🚀 (v6 execution started)
Current PATH: Multi-tier embeddings implementation
Previous PHASE_1: COMPLETE ✅ (85% - Functional MVP achieved)
Database: v5.1 schema with all 6 tables deployed ✅
Docker: 4-container stack (postgres + api + E5 + ada-002) ✅
Embeddings E5: Real E5-large-v2 Python service on port 8000 ✅
Embeddings Ada: OpenAI ada-002 service on port 8001 ✅ NEW!
Search: Semantic search with >0.8 similarity working ✅
Current Work: Database schema update for ada-002 vectors
```

### EPIC-TIDE Methodology
```yaml
Current Version: v5.1 (Corrected Hierarchy + Evidence-Driven)
Templates: v5.1 (proper nesting + shared WORKs)
Major Fix: Folder structure now matches hierarchy
Key Insight: WORKs are reusable components (shared pool)
Core Principle: EVIDENCE-DRIVEN, not time-driven
Progress By: Evidence & Events, NOT schedules or timelines
Migration Status: 16/16 WORKs v4 compliant (100%)
Architecture: KG4EPIC passive storage only
```

## Active TODOs

### 🔴 Current (In Progress)
```yaml
PHASE_2 EXECUTION (v6):
  - [x] Created execution_1.yml from v6 blueprint
  - [x] Prepared ada-002 integration (API key verified)
  - [x] Created ada-002 embeddings service (port 8001)
  - [ ] Update database schema for ada-002 vectors
  - [ ] Implement dual embedding API endpoints
  - [ ] Create hybrid search with weighted scoring

PHASE_2 Progress: 2/20 works complete (10%)
```

### 🟡 Pending (Next Up)
```yaml
DEVELOPER:
  - [ ] Start PHASE_2 PATH execution
  - [ ] Implement ada-002 embeddings tier
  - [ ] Create pattern extraction from TIDEs
  - [ ] Build comprehensive test suite

SUPERVISOR:
  - [x] PHASE_1 completion assessment done
  - [ ] Create PHASE_2 architecture review
  - [ ] Monitor technical debt reduction
  - [ ] Validate PHASE_2 progress
```

### 🟢 Future (Planned)
```yaml
PHASE_3:
  - [ ] Add text-embedding-3-large tier
  - [ ] Implement knowledge graph features
  - [ ] Create MCP tools for EPIC-TIDE
  - [ ] Build pattern library

ARCHITECT:
  - [ ] Design v6 with multi-agent support
  - [ ] Create learning synthesis algorithms
  - [ ] Develop automatic pattern extraction
```

## Quick Commands

### For Developer Session:
```bash
# Start work
cd /Users/inseokseo/Gineers-Projects/Gineers-KG4EPIC
cat CLAUDE_GKG4EPIC_developer.md

# Check progress
ls Docs/Gineers-KG4EPIC/EXECUTIONs/tides/
```

### For Architect Session:
```bash
# Review methodology
cat CLAUDE_methodology_creator.md
ls Docs/EPIC-TIDE-ADV/
```

### For Supervisor Session:
```bash
# Start review
cd /Users/inseokseo/Gineers-Projects/Gineers-KG4EPIC
cat CLAUDE_GKG4EPIC_supervisor.md

# Check monitoring reports
ls Docs/Monitoring-Gineers-KG4EPIC/
```

## Critical Decisions Log
- **2025-01-27**: Created v3 AI-Native methodology
- **2025-01-27**: Migrated 4 critical WORKs to v4
- **2025-01-28 AM**: Completed v4 migration (16/16 WORKs)
- **2025-01-28 AM**: Added Supervisor role for architecture review
- **2025-01-28 PM**: ARCHITECTURAL - KG4EPIC = Passive Storage Only
- **2025-01-28 PM**: METHODOLOGY v5 - Added PHASE hierarchy level
- **2025-01-28 PM**: EMBEDDING STRATEGY - 3-tier (E5→ada-002→3-large)
- **2025-01-28 EVE**: v5.1 - Fixed folder structure to match hierarchy
- **2025-01-28 EVE**: CRITICAL - WORKs are shared pool, not PATH-owned
- **2025-01-28 EVE**: FUNDAMENTAL - No time/schedules, only evidence & events
- **2025-01-28 EVE**: PHASE_1 COMPLETE - 85% functional MVP achieved
- **2025-01-28 EVE**: TIDE_2 - Python embeddings service solution successful
- **2025-01-29**: PHASE_2 STARTED - v6 execution with multi-tier embeddings
- **2025-01-29**: Ada-002 SERVICE - OpenAI embeddings integrated (1536 dims)
- **API**: POST-only for security
- **DB**: PostgreSQL + pgvector + v5.1 schema (6 tables)
- **Embeddings**: E5-large-v2 via Python FastAPI (ONNX issues in Node)
- **Intelligence**: Deferred to separate Gineers-ACC system

## Git Instructions
```
{Detailed message}
Author: David Seo of Gineers.AI
```

## Session Handoff Notes
```yaml
Last Session: Developer - PHASE_2 v6 execution started
Current Status: PHASE_2 multi-tier embeddings in progress
Achievement: Ada-002 service successfully integrated
Next Action: Continue database schema update for dual embeddings

PHASE_2 Current Status:
  - Database: v5.1 schema (needs ada-002 columns) ⏳
  - Docker: 4-container stack operational ✅
  - E5 Embeddings: Python service on port 8000 ✅
  - Ada-002 Embeddings: OpenAI service on port 8001 ✅ NEW!
  - API: Needs v2 endpoints for dual embeddings ⏳
  
PHASE_2 Completed Works (2/20):
  1. prepare_ada002_integration ✅
  2. create_ada002_service ✅
  
Next Works to Execute:
  3. update_database_for_ada002
  4. implement_dual_embedding_api
  5. create_hybrid_search

Key Achievement: OpenAI ada-002 service running with rate limiting
```

---
*Completed TODOs archived in CLAUDE_TODO_HISTORY.md*  
*Technical details in role-specific CLAUDE_*.md files*  
*Methodology in Docs/EPIC-TIDE-ADV/*