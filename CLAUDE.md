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
PHASE_1_free: COMPLETE ✅ (85% - Functional MVP achieved)
Current Status: Ready for PHASE_2_enhanced
TIDE_1: Completed - Basic infrastructure established
TIDE_2: Completed - Real embeddings + semantic search working
Database: v5.1 schema with all 6 tables deployed ✅
Docker: 3-container stack (postgres + api + embeddings) ✅
Embeddings: Real E5-large-v2 Python service operational ✅
Search: Semantic search with >0.8 similarity working ✅
Next Action: Create PHASE_2 blueprint for enhanced embeddings
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
PHASE_2 PLANNING:
  - [ ] Create PHASE_2_enhanced blueprint
  - [ ] Design text-embedding-ada-002 integration
  - [ ] Plan pattern extraction features
  - [ ] Define success criteria for PHASE_2

TECHNICAL DEBT (from PHASE_1):
  - [ ] Create integration tests (HIGH priority)
  - [ ] Complete API documentation
  - [ ] Fix embeddings service health check
  - [ ] Add monitoring and logging
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
Last Session: Supervisor - PHASE_1 completion assessment
Status: PHASE_1_free COMPLETE (85% functional)
Achievement: Working KG4EPIC with real embeddings & semantic search
Next Session: Developer or Architect for PHASE_2 planning

PHASE_1 Final Status:
  - Database: v5.1 schema with 6 tables ✅
  - Docker: 3-container stack operational ✅
  - Embeddings: Real E5-large-v2 via Python service ✅
  - Search: Semantic search with >0.8 similarity ✅
  - API: All EPIC-TIDE operations functional ✅
  
Technical Debt to Address:
  - Testing: No automated tests (HIGH priority)
  - Documentation: API docs incomplete (MEDIUM)
  - Health Check: Embeddings service display issue (LOW)
  - Monitoring: No logging aggregation (LOW)

Key Learning: Python microservice for embeddings solved Node.js ONNX issues
```

---
*Completed TODOs archived in CLAUDE_TODO_HISTORY.md*  
*Technical details in role-specific CLAUDE_*.md files*  
*Methodology in Docs/EPIC-TIDE-ADV/*