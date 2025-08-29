# EPIC-TIDE v5.1: Corrected Hierarchical Structure

## Core Principle: EVIDENCE-DRIVEN, Not Time-Driven

### The Fundamental Rule
**EPIC-TIDE does NOT use time, schedules, or deadlines.**
- Progress is measured by **evidence** and **events**
- Completion is determined by **success criteria**, not calendars
- Iterations continue until **evidence demonstrates success**
- No timelines, no time estimates, no schedules

### Why Evidence Over Time
1. **Time predictions are always wrong** - Software is discovery, not construction
2. **Evidence is objective** - Either the endpoint works or it doesn't
3. **Events drive coordination** - Teams react to evidence, not schedules
4. **Learning accumulates naturally** - Each TIDE produces evidence of what works

## Critical Fix from v5.0

### The Problem (Discovered 2025-01-28)
v5.0 introduced PHASE hierarchy but folder structure didn't reflect it properly:
- PHASEs and PATHs were siblings instead of nested
- WORKs placement was ambiguous
- EXECUTIONs didn't mirror BLUEPRINTs structure
- Database schema didn't align with hierarchy

### The Solution (v5.1)
**Proper hierarchical folder structure with reusable WORKs pool**

## The Corrected Hierarchy

```
PROGRAM
└── PHASE (Scope boundary)
    └── PATH (Implementation approach)
        └── TIDE (Execution attempt)
            └── PATTERN (Extracted knowledge)

With WORK as reusable components across all levels
```

## Folder Structure (v5.1 Corrected)

### BLUEPRINTs Structure
```
BLUEPRINTs/
├── phases/
│   ├── PHASE_1_free.yml              # Phase definition
│   ├── PHASE_1_free/                 # Phase folder
│   │   └── paths/
│   │       ├── kg4epic-mvp.yml       # PATH under PHASE
│   │       └── kg4epic-testing.yml
│   ├── PHASE_2_enhanced.yml
│   └── PHASE_2_enhanced/
│       └── paths/
│           ├── tiered-embedding.yml
│           └── semantic-search.yml
└── works/                             # SHARED POOL (reusable)
    ├── setup-nodejs-project-v4.yml
    ├── setup-docker-environment-v4.yml
    └── implement-post-api-v4.yml
```

### EXECUTIONs Structure (Mirrors BLUEPRINTs)
```
EXECUTIONs/
└── phases/
    └── PHASE_1_free/
        └── paths/
            └── kg4epic-mvp/
                ├── TIDE_1/
                │   ├── execution.yml
                │   ├── learnings.yml
                │   └── artifacts/
                ├── TIDE_2/
                └── patterns/          # Extracted from TIDEs
```

### KNOWLEDGE Structure
```
KNOWLEDGE/
├── patterns/                          # Cross-project patterns
│   ├── technical/
│   ├── process/
│   └── business/
└── learnings/                         # Synthesized learnings
    ├── by-phase/
    ├── by-technology/
    └── by-problem-type/
```

## Key Principle: WORKs are Reusable

### Why WORKs Live in a Shared Pool
1. **Cross-PATH Reusability**: Same WORK can be used in multiple PATHs
2. **Cross-PHASE Applicability**: WORKs evolve and improve across PHASEs
3. **Version Management**: Single source of truth for each WORK
4. **Pattern Extraction**: Easier to identify patterns across usage

### Example WORK Usage
```yaml
# In PHASE_1_free/paths/kg4epic-mvp.yml
PATH:
  works:
    - ../../../works/setup-nodejs-project-v4
    - ../../../works/setup-docker-environment-v4
    
# In PHASE_2_enhanced/paths/api-expansion.yml  
PATH:
  works:
    - ../../../works/setup-docker-environment-v4  # Reused
    - ../../../works/implement-graphql-api-v4      # New
```

## Database Schema Alignment (v5.1)

```sql
-- Hierarchical structure
CREATE TABLE phases (
    id UUID PRIMARY KEY,
    phase_id VARCHAR(100) UNIQUE,
    scope JSONB,
    architecture JSONB,
    status VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE paths (
    id UUID PRIMARY KEY,
    path_id VARCHAR(100) UNIQUE,
    phase_id UUID REFERENCES phases(id),  -- Child of PHASE
    approach JSONB,
    decisions JSONB,
    status VARCHAR(50)
);

CREATE TABLE tides (
    id UUID PRIMARY KEY,
    tide_number INTEGER,
    path_id UUID REFERENCES paths(id),    -- Child of PATH
    outcome VARCHAR(50),
    learnings JSONB,
    executed_at TIMESTAMP
);

-- Reusable components
CREATE TABLE works (
    id UUID PRIMARY KEY,
    work_id VARCHAR(100) UNIQUE,
    version VARCHAR(10),
    context JSONB,
    knowledge JSONB,
    artifacts JSONB,
    -- No foreign key to PATH (works are shared)
);

-- Many-to-many relationship
CREATE TABLE path_works (
    path_id UUID REFERENCES paths(id),
    work_id UUID REFERENCES works(id),
    sequence INTEGER,
    PRIMARY KEY (path_id, work_id)
);

-- Extracted patterns
CREATE TABLE patterns (
    id UUID PRIMARY KEY,
    pattern_name VARCHAR(200),
    source_tide_id UUID REFERENCES tides(id),
    pattern_type VARCHAR(50),
    problem_category VARCHAR(100),
    solution JSONB,
    reusability_score INTEGER
);
```

## Information Flow in v5.1

### Session Bootstrap
```
1. CLAUDE.md → Minimal dispatcher (30 lines)
2. PHASE document → Strategic context + scope
3. PATH document → Implementation approach
4. WORK documents → Specific task details (from shared pool)
5. TIDE execution → With full hierarchical context
6. Learning capture → Updates at all levels
```

### Learning Accumulation Paths
```
TIDE failures → PATH adaptations
PATH completions → PHASE expansions
PHASE patterns → PROGRAM evolution
WORK improvements → Shared pool enhancement
```

## Migration from v5.0 to v5.1

### Step 1: Create Proper Folder Structure
```bash
# Create nested structure
mkdir -p BLUEPRINTs/phases/PHASE_1_free/paths
mkdir -p EXECUTIONs/phases/PHASE_1_free/paths

# Move PATHs under their PHASEs
mv BLUEPRINTs/paths/kg4epic-mvp.yml \
   BLUEPRINTs/phases/PHASE_1_free/paths/

# Keep WORKs in shared pool
# Already at BLUEPRINTs/works/ - correct location
```

### Step 2: Update PATH References
```yaml
# Update PATH files to reference parent PHASE
PATH:
  phase_id: PHASE_1_free
  phase_ref: ../../PHASE_1_free.yml  # Relative reference
```

### Step 3: Update WORK References
```yaml
# PATHs reference WORKs from shared pool
PATH:
  works:
    - ref: ../../../works/setup-nodejs-project-v4.yml
      purpose: "Initialize Node.js project"
```

### Step 4: Align Database Schema
- Add proper foreign keys for hierarchy
- Create junction table for PATH-WORK relationships
- Ensure no direct WORK-PATH ownership

## Benefits of v5.1 Structure

### 1. **Clear Hierarchy**
Visual folder structure matches conceptual hierarchy

### 2. **Work Reusability**
WORKs truly shareable across entire system

### 3. **Execution Tracking**
EXECUTIONs mirror BLUEPRINTs for easy navigation

### 4. **Database Alignment**
Schema properly represents relationships

### 5. **Pattern Extraction**
Clearer paths for pattern identification

## The Philosophy Evolution

> "v5.1 corrects the implementation to match the vision: PHASEs contain PATHs, PATHs execute TIDEs, while WORKs remain reusable components available to all. The folder structure now visually represents the conceptual hierarchy."

## Summary of v5.1 Changes

### From v5.0
- PHASE hierarchy concept ✓
- Vertical vs horizontal growth ✓
- Multi-level learning ✓

### New in v5.1
- **Corrected folder structure** with proper nesting
- **WORKs as shared pool** explicitly defined
- **EXECUTIONs mirror BLUEPRINTs** structure
- **Database schema aligned** with hierarchy
- **Clear migration path** from v5.0

This correction ensures that the physical structure matches the conceptual model, making EPIC-TIDE more intuitive and maintainable.