# EPIC-TIDE Execution Instructions for Gineers-KG4EPIC

## 🚀 Project: Gineers-KG4EPIC
**Mission**: Implement Passive knowledge graph server for EPIC-TIDE methodology with CONTRACT + ROUTE + TIDE

## 📍 Current Status
- **Active PoC**: PoC_1_CORE
- **Active ROUTE**: ROUTE_EPIC_TIDE_CORE
- **Current TIDE**: TIDE_1 (Planning)
- **Completed CONTRACTs**: 0/8

## ⚠️ MULTI-SESSION PROTOCOL ⚠️
***This CLAUDE_4_EPIC.md manages concurrent EPIC-TIDE execution sessions***

### Session Initialization:
1. **ASK USER**: "What is my terminal role? (terminal-1-architect or terminal-2-dev)"
2. **VERIFY** role responsibilities below
3. **UPDATE** your section with current timestamp
4. **EXECUTE** according to your role
5. **DOCUMENT** all evidence in appropriate TIDE

## 👥 Role Definitions

### Terminal-1-Architect (ROUTE Handler)
**Responsibilities**:
- Monitor ROUTE execution progress
- Track evidence gates
- Decide when to create new TIDE
- Extract learnings from failed TIDEs
- Mark ROUTEs as proven
- Update PROJECT_ROUTE.md status

**Do NOT**:
- Execute CONTRACTs directly
- Modify CONTRACT content
- Skip evidence requirements

### Terminal-2-Dev (CONTRACT Executor)
**Responsibilities**:
- Execute CONTRACTs sequentially
- Collect evidence for each CONTRACT
- Report failures to architect
- Implement fixes based on TIDE learnings
- Update CONTRACT status

**Do NOT**:
- Skip CONTRACTs in sequence
- Mark ROUTE as proven
- Create new TIDEs

## 📋 Active Sessions and Progress

### Terminal-1-Architect
<!-- Last updated: [TIMESTAMP] -->
#### Status: ⏸️ Waiting
#### Current TIDE: TIDE_1_PLANNED
#### Evidence Gates Passed: 0/4
#### Monitoring:
- [ ] GATE_1_DATABASE: Waiting for CONTRACT_001 & CONTRACT_002
- [ ] GATE_2_SCHEMA: Waiting for database tables
- [ ] GATE_3_APIS: Waiting for CRUD operations
- [ ] GATE_4_EXECUTION: Waiting for TIDE demonstration

#### Decisions Pending:
- None

### Terminal-2-Dev
<!-- Last updated: [TIMESTAMP] -->
#### Status: 🔄 Ready to Execute
#### Current CONTRACT: None (Start with CONTRACT_001)
#### Execution Progress:
- [ ] CONTRACT_001_DOCKER_SETUP
- [ ] CONTRACT_002_DATABASE_SCHEMA
- [ ] CONTRACT_003_API_STRUCTURE
- [ ] CONTRACT_004_CONTRACT_CRUD
- [ ] CONTRACT_005_ROUTE_CRUD
- [ ] CONTRACT_006_TIDE_EXECUTION
- [ ] CONTRACT_007_TEST_EXECUTION
- [ ] CONTRACT_008_LEARNING_EXTRACTION

#### Evidence Collected:
- None yet

## 🗂️ EPIC-TIDE Document Locations

### CONTRACTs (What to Execute)
```
Docs/Gineers-KG/CONTRACTS/
├── CONTRACT_001_DOCKER_SETUP.md
├── CONTRACT_002_DATABASE_SCHEMA.md
├── CONTRACT_003_API_STRUCTURE.md
├── CONTRACT_004_CONTRACT_CRUD.md
├── CONTRACT_005_ROUTE_CRUD.md
├── CONTRACT_006_TIDE_EXECUTION.md
├── CONTRACT_007_TEST_EXECUTION.md
└── CONTRACT_008_LEARNING_EXTRACTION.md
```

### ROUTE (The Plan)
```
Docs/Gineers-KG/PoC_1_CORE/ROUTES/
└── ROUTE_EPIC_TIDE_CORE.md
```

### TIDEs (Execution History)
```
Docs/Gineers-KG/PoC_1_CORE/TIDES/
├── TIDE_1_PLANNED.md      # Current - Planning phase
└── TIDE_2_[STATUS].md     # Create if TIDE_1 fails
```

## 🔄 Execution Flow

### For Terminal-2-Dev (CONTRACT Execution):
```yaml
1. Read CONTRACT_XXX document
2. Execute the "how" section
3. Validate against "evidence_required"
4. If success:
   - Document evidence
   - Move to next CONTRACT
5. If failure:
   - Document failure reason
   - Report to Terminal-1-Architect
   - Wait for TIDE decision
```

### For Terminal-1-Architect (ROUTE Monitoring):
```yaml
1. Monitor CONTRACT execution
2. Verify evidence at each gate
3. If CONTRACT fails:
   - Document learning in current TIDE
   - Decide: Fix in current TIDE or create new TIDE
4. If all CONTRACTs succeed:
   - Mark ROUTE as proven
   - Update PROJECT_ROUTE.md
   - Extract patterns for future reuse
```

## 🚨 Evidence Requirements

### What Counts as Evidence:
- Screenshots of running services
- Successful API responses
- Database query results
- Test execution logs
- Error messages (for learning)

### What Does NOT Count:
- "It should work" statements
- Untested code
- Partial implementations
- Missing error handling

## 🎯 Current Execution Context

### Docker Ports (Non-conflicting):
```yaml
PostgreSQL: 5437 (external) -> 5432 (internal)
API Server: 3001 (external) -> 3001 (internal)  
Redis: 6383 (external) -> 6379 (internal)
```

### Database:
```yaml
Name: gineers_kg4epic
User: postgres
Password: kg4epic_password
```

### Key Commands:
```bash
# Start services
docker-compose -f docker-compose.kg4epic.yml up -d

# Check health
curl http://localhost:3001/health

# Database connection
psql -h localhost -p 5437 -U postgres -d gineers_kg4epic

# View logs
docker-compose -f docker-compose.kg4epic.yml logs -f
```

## 📝 TIDE Documentation Template

When documenting in TIDE:
```yaml
CONTRACT_ID:
  status: [pending|in_progress|completed|failed]
  evidence: "What was observed"
  issues: "What went wrong (if failed)"
  learning: "What we learned"
  time: "Execution duration"
```

## ⚡ Quick Status Check

### Before Starting:
- [ ] Identified your terminal role
- [ ] Located CONTRACT/ROUTE documents
- [ ] Understood evidence requirements
- [ ] Docker Desktop running

### During Execution:
- [ ] Following CONTRACT sequence
- [ ] Collecting evidence
- [ ] Documenting in TIDE
- [ ] Communicating failures

### After CONTRACT:
- [ ] Evidence validated
- [ ] Status updated
- [ ] Next CONTRACT identified
- [ ] Learning captured (if failed)

## 🔴 STOP Conditions

### Stop CONTRACT Execution If:
- Required dependencies not met
- Previous CONTRACT failed
- Evidence cannot be collected
- Architect calls for TIDE change

### Stop ROUTE Execution If:
- Critical CONTRACT fails without recovery
- Evidence gates cannot be passed
- Infrastructure issues block progress

## 💡 Learning Preservation

### Document ALL Failures:
Every failure is learning. Document:
- What was attempted
- What failed
- Why it failed  
- How to fix it
- Time to resolution

### Success Patterns:
Also document what worked well for reuse:
- Efficient approaches
- Time-saving shortcuts
- Reusable configurations

---

## Session Notes
<!-- Add session-specific notes here -->

---

*EPIC-TIDE Execution: Where plans (ROUTEs) meet reality (TIDEs) through executable units (CONTRACTs)*

**Remember**: 
- Terminal-1-Architect = ROUTE oversight
- Terminal-2-Dev = CONTRACT execution
- Evidence drives progress, not time
- Learning from failure is success