# EPIC-TIDE Execution with Claude Code

## 🚀 Quick Start for Claude Code
**When user opens this as CLAUDE.md, Claude Code should:**
1. **ASK**: "What PATH are we executing today?"
2. **USE TodoWrite**: Track all WORKs in the PATH
3. **EXECUTE**: Follow WHAT/HOW/METRIC structure
4. **DOCUMENT**: Update TIDE with evidence

## 📍 Core Concepts
```yaml
PATH: "The milestones/journey" (project plan)
WORK: "The practical tasks" (reusable units)
TIDE: "The execution attempt" (what actually happened)
```

## ⚠️ MULTI-SESSION PROTOCOL ⚠️
***Multiple Claude Code windows can work on the same project***

### Session Initialization:
1. **ASK USER**: "Which role for this session? (architect or executor)"
2. **IF NEW PROJECT**: Create folder structure
3. **USE TodoWrite**: Load PATH into todo list
4. **TRACK PROGRESS**: Update TIDEs with evidence

## 👥 Role Definitions for Claude Code

### Architect Role (PATH Monitor)
**Claude Code Responsibilities**:
```yaml
- Read PATH document and create TodoWrite items
- Monitor WORK execution progress via TodoWrite
- Track METRIC checkboxes completion
- Decide when to create new TIDE (if failures)
- Extract learnings and update documents
- Mark PATH as proven when all METRICs checked
```

**Claude Code Actions**:
```bash
# Tools to use
- TodoWrite: Track PATH progress
- Read: Check WORK evidence
- Write: Update TIDE documents
- Grep/Glob: Find related patterns
```

### Executor Role (WORK Implementation)
**Claude Code Responsibilities**:
```yaml
- Read WORK documents sequentially
- Execute HOW steps using available tools
- Collect evidence (screenshots, logs, test results)
- Update METRIC checkboxes in TodoWrite
- Report failures with detailed learnings
```

**Claude Code Actions**:
```bash
# Tools to use
- TodoWrite: Track WORK completion
- Bash: Execute commands
- Read/Write/Edit: Implement code
- Test execution and validation
```

## 📁 EPIC-TIDE Folder Structure

```
Docs/{project_name}/
├── BLUEPRINTs/              # Plans (don't modify during execution)
│   ├── PATHs/
│   │   └── PATH_{project}.md
│   └── WORKs/
│       └── WORK_{task}_PATH_{project}.md
│
└── EXECUTIONs/              # Reality (update during execution)
    └── TIDEs/
        ├── TIDE_1_PATH_{project}.md
        └── TIDE_2_PATH_{project}.md  # If TIDE_1 fails
```

## 🔄 Claude Code Execution Flow

### Starting a New Project
```yaml
User: "Let's build a Flappy Bird game"
Claude: 
  1. Create PATH_Flappy_Bird.md with WHAT/HOW/METRIC
  2. Create necessary WORK documents
  3. Use TodoWrite to track all WORKs
  4. Start TIDE_1 execution
```

### Executing WORKs
```yaml
For each WORK in TodoWrite:
  1. Read WORK document
  2. Execute HOW steps:
     - Use Bash for commands
     - Use Write/Edit for code
     - Use Read to verify
  3. Check METRIC boxes:
     [ ] → [✅] if evidence collected
     [ ] → [❌] if failed
  4. Update TodoWrite status
  5. Document in TIDE
```

### Handling Failures
```yaml
When WORK fails:
  1. Document exact error in TIDE
  2. Capture learning (why it failed)
  3. Mark as failed in TodoWrite
  4. IF fixable in current TIDE:
     - Apply fix and retry
  5. ELSE:
     - Complete TIDE_1 as "partial"
     - Create TIDE_2 with fixes
```

## 📝 Document Templates for Claude Code

### PATH Template
```yaml
PATH_{ProjectName}:
  WHAT: "Goal to achieve"
  HOW:
    - WORK_Setup_Environment
    - parallel:
        - WORK_Create_Backend
        - WORK_Create_Frontend
    - WORK_Integration_Tests
  METRIC:
    [ ] System runs locally
    [ ] All features working
    [ ] Tests passing
```

### WORK Template
```yaml
WORK_{TaskName}:
  WHAT: "Specific task goal"
  HOW:
    - "Step 1: Concrete action"
    - "Step 2: Another action"
  METRIC:
    [ ] Measurable outcome 1
    [ ] Measurable outcome 2
```

### TIDE Template (Claude Code Updates)
```yaml
TIDE_1_PATH_{ProjectName}:
  WHAT: "First attempt at PATH"
  HOW:
    WORK_Setup_Environment:
      status: ✅
      evidence: "npm install successful, server runs"
      tools_used: [Bash, Write]
    WORK_Create_Backend:
      status: ❌
      evidence: "Database connection timeout"
      error: "Pool size too small"
      learning: "Increase pool to 20 connections"
  METRIC:
    [✅] System runs locally
    [❌] All features working
    [ ] Tests passing
  outcome: "partial - 33% complete"
```

## 🎯 Claude Code Best Practices

### 1. Always Use TodoWrite
```python
# Good: Track everything
TodoWrite([
  {"content": "Setup environment", "status": "pending"},
  {"content": "Create database", "status": "pending"},
  {"content": "Build API", "status": "pending"}
])

# Update as you go
TodoWrite([
  {"content": "Setup environment", "status": "completed"},
  {"content": "Create database", "status": "in_progress"}
])
```

### 2. Collect Real Evidence
```bash
# Good: Capture actual output
npm test > test_results.log
cat test_results.log  # Read and document

# Bad: Assuming it works
"Tests should pass"
```

### 3. Document Everything in TIDE
```yaml
# Good: Detailed evidence
WORK_Database_Setup:
  status: ✅
  evidence: |
    - Created 5 tables
    - psql output: "CREATE TABLE"
    - Connection test: 15ms response
  duration: "8 minutes"

# Bad: Vague status
WORK_Database_Setup: "done"
```

### 4. Learn from Failures
```yaml
# Good: Actionable learning
learning: "Express needs body-parser middleware for POST"
fix: "Add app.use(express.json()) before routes"

# Bad: Generic statement  
learning: "It didn't work"
```

## 🚨 Evidence Requirements for Claude Code

### Valid Evidence:
- Command output (via Bash tool)
- File contents (via Read tool)
- Test results (actual execution)
- Error messages (full stack trace)
- Screenshots (if UI involved)

### Invalid Evidence:
- "Should work" assumptions
- Untested implementations
- Partial completions without verification
- Missing error handling

## ⚡ Quick Commands for Claude Code

```bash
# Create project structure
mkdir -p Docs/{project}/BLUEPRINTs/{PATHs,WORKs}
mkdir -p Docs/{project}/EXECUTIONs/TIDEs

# Check current progress
grep -r "status:" Docs/{project}/EXECUTIONs/TIDEs/

# Find reusable WORKs
find Docs -name "WORK_*Database*.md"

# Count completed metrics
grep "✅" TIDE_1_*.md | wc -l
```

## 🔴 STOP Conditions for Claude Code

### Stop WORK Execution If:
```yaml
- Missing dependencies (npm package, service)
- Previous WORK in sequence failed
- User explicitly asks to stop
- Evidence cannot be collected
```

### Create New TIDE If:
```yaml
- Multiple WORKs failed
- Fundamental issue discovered
- Different approach needed
- User requests fresh attempt
```

## 💡 Learning Extraction for Claude Code

### After Each TIDE:
1. **Extract patterns** from successful WORKs
2. **Document failures** with root causes
3. **Create reusable** WORK templates
4. **Update PATH** if sequence needs change

### Knowledge Evolution:
```yaml
3+ similar WORKs → DISTILLED_WORK → Reusable template
3+ similar PATHs → DISTILLED_PATH → Project template
Proven patterns → WHISTLE → Instant command
```

## 📊 Progress Tracking Example

```yaml
Claude Code TodoWrite Display:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TODO LIST: PATH_Memo_Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[✅] Setup environment
[✅] Initialize database  
[🔄] Create API endpoints (in progress)
[⬜] Add authentication
[⬜] Write tests
[⬜] Deploy to cloud
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Progress: 2/6 (33%)
Current TIDE: TIDE_1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎬 Session Notes for Claude Code
<!-- Claude Code should update this section -->

### Current Session:
- **Role**: [architect|executor]
- **PATH**: [Active PATH name]
- **TIDE**: [Current TIDE number]
- **WORKs Completed**: [X/Y]
- **Last Update**: [timestamp]

### Active Issues:
- [Issue 1 and proposed fix]
- [Issue 2 and proposed fix]

### Learnings This Session:
- [Key discovery 1]
- [Key discovery 2]

---

*EPIC-TIDE with Claude Code: Where AI autonomously executes PATHs through WORKs, learning from each TIDE*

**Remember for Claude Code**: 
- Always use TodoWrite for tracking
- Document real evidence, not assumptions
- Update TIDEs with actual outcomes
- Extract learnings from every failure
- Pure WORKs, orchestrated PATHs