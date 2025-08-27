# EPIC-TIDE: Evidence-Powered Iterative Coordination through Transformative Intelligence-Driven Execution

## The Core Trinity: PATH, WORK, and TIDE

### WORK
**Definition**: The practical tasks - "HOW TO BUILD WHAT"

```yaml
WORK:
  WHAT: "The thing to build"
  HOW: ["Step 1", "Step 2", "Step 3"]
  METRIC: 
    [ ] "Proof it worked"
    [ ] "Another verification"
```

### PATH  
**Definition**: The blueprint - "PLANNED SEQUENCE OF WORKs TO ACHIEVE A GOAL"

```yaml
PATH:
  WHAT: "The goal to achieve"
  HOW: 
    - WORK_1
    - parallel: [WORK_2, WORK_3]
    - WORK_4
  METRIC:
    [ ] "Milestone 1 reached"
    [ ] "Milestone 2 reached"
  
  # PATHs are IMMUTABLE blueprints - they don't change during execution
```

### TIDE
**Definition**: The actual path through execution - "WHAT PATH WAS ACTUALLY TAKEN"

```yaml
TIDE:
  # TIDE shows the ACTUAL execution path, which may diverge from blueprint
  WHAT: "Actual execution path for attempt #N"
  
  PLANNED_PATH: "PATH_1"  # Original blueprint
  ACTUAL_PATH:            # What really happened
    - WORK_1: ✅
    - WORK_2: ✅  
    - WORK_3: ❌ → WORK_3_fixed: ✅  # Diverged from plan!
    - WORK_4: ✅
  
  METRIC:
    [✅] "Milestone 1 reached" 
    [✅] "Milestone 2 reached"  # Success via modified path
  
  # TIDE_1 always starts as exact copy of blueprint
  # TIDE_2+ can diverge based on learnings
```

## The Key Innovation: TIDE as Actual Path Through

**Critical Insight**: TIDE isn't just logging - it's the ACTUAL PATH taken through execution

```yaml
Blueprint (PATH): W1 → W2 → W3 → W4  # The plan
TIDE_1: W1 → W2 → W3(fail) → W4(blocked)  # First attempt follows blueprint
TIDE_2: W1 → W2 → W3_fixed → W4  # Adapted path based on learning
TIDE_3: W1 → W2 → W5 → W4  # Completely different path (W3 replaced)
```

## Blueprint vs Actual Execution

```yaml
PATH: "The immutable blueprint" (Never changes)
TIDE: "The actual path taken" (Can diverge from blueprint)

# Evolution Process:
1. TIDE_1 = Exact copy of PATH (pristine first attempt)
2. TIDE_1 fails at some WORK
3. TIDE_2 = Modified path based on TIDE_1 learnings
4. Continue until success
5. Successful TIDE → Becomes PROVEN_PATH for future reuse

# Think: Blueprint (PATH) → Try (TIDE_1) → Learn → Adapt (TIDE_2) → Succeed → Extract Pattern
```

## Evidence-Driven Evolution

✅ Every WORK requires evidence (METRIC)  
✅ TIDE tracks actual vs planned execution  
✅ Failed WORKs trigger path adaptation  
✅ Successful TIDE becomes new knowledge  

## TIDE Execution Rules

### TIDE_1: The Pristine Attempt
```yaml
TIDE_1:
  # Always exact copy of blueprint
  # No modifications allowed
  # Pure test of the plan
  PLANNED_PATH: PATH_1
  ACTUAL_PATH: [Follows PATH_1 exactly]
  # Discovers what works and what doesn't
```

### TIDE_2+: The Evolution
```yaml
TIDE_2:
  # Can diverge from blueprint based on TIDE_1 learnings
  PLANNED_PATH: PATH_1
  ACTUAL_PATH: 
    - WORK_1 (reused - worked in TIDE_1)
    - WORK_2 (reused - worked in TIDE_1)
    - WORK_3_fixed (modified - failed in TIDE_1)
    - WORK_4 (original - now unblocked)
  
  MODIFICATIONS:
    WORK_3_fixed:
      based_on: WORK_3
      changes: "Fixed connection pool size"
      learning_from: TIDE_1
```

## Orchestration in PATH (Immutable Blueprint)

PATHs define the intended sequence - they never change:

```yaml
PATH:
  HOW:
    # Sequential (default)
    - WORK_Setup
    - WORK_Database
    
    # Parallel (explicit)
    - parallel:
        - WORK_API
        - WORK_Frontend
    
    # Nested PATH (for complex milestones)  
    - PATH_Authentication:
        - WORK_Users_Table
        - WORK_JWT_Logic
        - WORK_Login_API
  
  # This blueprint remains unchanged
  # TIDEs may execute differently, but PATH stays pristine
```

## Why WORKs are Pure

WORKs contain **NO** project-specific triggers or dependencies:

```yaml
# ✅ CORRECT: Pure WORK
WORK_Database_Setup:
  WHAT: "Initialize database"
  HOW: ["Create schema", "Run migrations"]
  METRIC: [ ] "Tables created"
  # NO triggers, pure and reusable

# TIDEs can modify HOW during execution
WORK_Database_Setup_Fixed:  # Created during TIDE_2
  WHAT: "Initialize database"  # Same WHAT
  HOW: ["Create schema", "Set pool=20", "Run migrations"]  # Modified HOW
  METRIC: [ ] "Tables created"  # Same METRIC
```

## Example: Flappy Bird Game - Path Evolution

### The PATH (Immutable Blueprint)
```yaml
PATH_Flappy_Bird:
  WHAT: "Simple Flappy Bird game"
  HOW:
    - WORK_Setup_Game_Environment
    - WORK_Initialize_Game_Objects
    - WORK_Game_Loop
    - WORK_Game_Over_State
  METRIC:
    [ ] Game window opens
    [ ] Bird responds to input
    [ ] Collision detection works
    [ ] Score increments properly
```

### TIDE_1 (Pristine Attempt - Follows Blueprint)
```yaml
TIDE_1_PATH_Flappy_Bird:
  WHAT: "First attempt following blueprint exactly"
  PLANNED_PATH: PATH_Flappy_Bird
  ACTUAL_PATH:
    WORK_Setup_Game_Environment: ✅
    WORK_Initialize_Game_Objects: ❌ "Bird falls through floor"
    WORK_Game_Loop: ⏸️ "Blocked"
    WORK_Game_Over_State: ⏸️ "Blocked"
  
  METRIC:
    [✅] Game window opens
    [❌] Bird responds to input
    [ ] Collision detection works
    [ ] Score increments
  
  outcome: "partial - 25% complete"
  learning: "Need collision boundaries in game objects"
```

### TIDE_2 (Evolved Path - Adapts Based on Learning)
```yaml
TIDE_2_PATH_Flappy_Bird:
  WHAT: "Second attempt with fixed collision"
  PLANNED_PATH: PATH_Flappy_Bird
  ACTUAL_PATH:
    WORK_Setup_Game_Environment: ✅ (reused)
    WORK_Initialize_Game_Objects_With_Collision: ✅ (modified)
    WORK_Game_Loop: ✅
    WORK_Game_Over_State: ✅
  
  MODIFICATIONS:
    WORK_Initialize_Game_Objects_With_Collision:
      based_on: WORK_Initialize_Game_Objects
      change: "Added floor collision boundary"
      reason: "TIDE_1 showed bird falling through floor"
  
  METRIC:
    [✅] Game window opens
    [✅] Bird responds to input
    [✅] Collision detection works
    [✅] Score increments
  
  outcome: "success - PATH proven via modified route"
```

### Knowledge Extraction
```yaml
PROVEN_PATH_Flappy_Bird:
  # Extracted from successful TIDE_2
  # This is the path that ACTUALLY WORKS
  derived_from: TIDE_2_PATH_Flappy_Bird
  HOW:
    - WORK_Setup_Game_Environment
    - WORK_Initialize_Game_Objects_With_Collision  # The fix
    - WORK_Game_Loop
    - WORK_Game_Over_State
  
  # This becomes reusable knowledge
```

## The Three Laws of EPIC-TIDE

### 1. Every task is a WORK
If you're building something, write a WORK for it

### 2. Every project starts with a PATH blueprint
Sequence WORKs to create the intended path

### 3. TIDEs show actual paths taken
The successful TIDE becomes proven knowledge

## Storage Schema

```sql
-- Three core tables reflecting blueprint vs execution

CREATE TABLE works (
  work_id VARCHAR PRIMARY KEY,
  what TEXT NOT NULL,
  how JSONB NOT NULL,
  metric JSONB NOT NULL,
  version INTEGER DEFAULT 1  -- Track WORK evolution
);

CREATE TABLE paths (
  path_id VARCHAR PRIMARY KEY,
  what TEXT NOT NULL,
  how JSONB NOT NULL,  -- The blueprint
  metric JSONB NOT NULL,
  proven BOOLEAN DEFAULT FALSE,
  proven_by_tide VARCHAR,  -- Which TIDE proved this PATH
  immutable BOOLEAN DEFAULT TRUE  -- Blueprints don't change
);

CREATE TABLE tides (
  tide_id VARCHAR PRIMARY KEY,
  path_id VARCHAR REFERENCES paths(path_id),
  tide_number INTEGER NOT NULL,
  planned_path JSONB NOT NULL,  -- Original blueprint
  actual_path JSONB NOT NULL,   -- What actually executed
  modifications JSONB,           -- How path diverged
  metric JSONB NOT NULL,
  outcome VARCHAR CHECK (outcome IN ('success', 'partial', 'failed')),
  learnings TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(path_id, tide_number)
);
```

## Knowledge Evolution

### Project Level
```
Blueprint (PATH) → Execute (TIDE_1) → Learn → Adapt (TIDE_2) → Success → Extract Pattern
```

### Organization Level  
```
Multiple successful TIDEs → PROVEN_PATH
Similar PROVEN_PATHs → DISTILLED_PATH
Common fixes → WORK_PATTERNS
```

### Universal Level
```
DISTILLED patterns → WHISTLEs
Complete proven paths → Templates for instant reuse
```

## Why This Works

1. **Blueprints Stay Pure**: PATHs never change, maintaining clear intent
2. **Execution Adapts**: TIDEs can diverge to find what actually works
3. **Learning Preserved**: Each TIDE builds on previous attempts
4. **Success Captured**: Working paths become reusable knowledge
5. **Evolution Tracked**: See exactly how blueprint became reality

## The Power of TIDE as Actual Path

Without Path Evolution:
- Stuck with failed blueprints
- No adaptation during execution
- Learning lost between attempts

With Path Evolution:
- TIDE_1 tests blueprint
- TIDE_2+ adapts based on reality
- Successful path becomes new pattern
- Future projects start with proven paths

## Getting Started

### Your First PATH (Blueprint)
```yaml
PATH_My_Project:
  WHAT: "Working system"
  HOW:
    - WORK_Setup
    - WORK_Build
    - WORK_Test
  METRIC:
    [ ] System runs
```

### Your First TIDE (Actual Execution)
```yaml
TIDE_1_PATH_My_Project:
  PLANNED_PATH: PATH_My_Project
  ACTUAL_PATH:
    WORK_Setup: ✅
    WORK_Build: ❌ "Missing dependency"
    WORK_Test: ⏸️
  outcome: "partial"
  learning: "Need to install X first"

TIDE_2_PATH_My_Project:
  PLANNED_PATH: PATH_My_Project  
  ACTUAL_PATH:
    WORK_Setup: ✅ (reused)
    WORK_Install_Dependencies: ✅ (added)
    WORK_Build: ✅
    WORK_Test: ✅
  outcome: "success"
  # This successful path becomes reusable knowledge
```

## Summary

EPIC-TIDE with PATH as blueprint and TIDE as actual execution provides:
- **Clear Intent**: Immutable blueprints show original plan
- **Flexible Execution**: TIDEs can adapt based on reality
- **Learning Loop**: Each TIDE builds on previous attempts
- **Knowledge Capture**: Successful paths become patterns
- **True Evolution**: See exactly how plans become working systems

---

*EPIC-TIDE: Where blueprints (PATHs) evolve through actual execution (TIDEs) into proven patterns*