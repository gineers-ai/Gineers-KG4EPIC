# EPIC-TIDE Standard Project Structure Guide v5.1

## Core Principle: Evidence-Driven Hierarchy

This guide defines the standard folder structure for all EPIC-TIDE projects. The structure reflects the v5.1 hierarchical methodology: PROGRAM → PHASE → PATH → TIDE → PATTERN.

## Complete Project Structure

```
<project-root>/
├── src/                                    # Source code (project-specific)
│   └── [your application code]
│
├── Docs/                                   # All documentation
│   ├── EPIC-TIDE-ADV/                     # Methodology & templates
│   │   ├── EPIC_TIDE_METHODOLOGY_*.md     # Core methodology docs
│   │   ├── TEMPLATES/                     # v5.1 templates
│   │   │   ├── PHASE_v5_1_ai_native.yml
│   │   │   ├── PATH_v5_1_ai_native.yml
│   │   │   ├── WORK_v5_1_ai_native.yml
│   │   │   └── TIDE_v5_1_ai_native.yml
│   │   └── archive/                       # Old versions
│   │
│   ├── <project-name>/                    # Project-specific EPIC-TIDE docs
│   │   ├── BLUEPRINTs/                   # Planning documents
│   │   │   ├── phases/                   # PHASE definitions (v5.1)
│   │   │   │   ├── PHASE_1_mvp.yml      # Phase definition file
│   │   │   │   ├── PHASE_1_mvp/         # Phase folder
│   │   │   │   │   └── paths/           # PATHs under this PHASE
│   │   │   │   │       ├── path-1.yml
│   │   │   │   │       └── path-2.yml
│   │   │   │   ├── PHASE_2_enhanced.yml
│   │   │   │   └── PHASE_2_enhanced/
│   │   │   │       └── paths/
│   │   │   │           └── path-3.yml
│   │   │   └── works/                    # SHARED POOL (v5.1 critical)
│   │   │       ├── work-1-v4.yml        # Reusable work units
│   │   │       ├── work-2-v4.yml
│   │   │       └── work-3-v4.yml
│   │   │
│   │   ├── EXECUTIONs/                   # Execution tracking
│   │   │   └── phases/                   # Mirrors BLUEPRINTs structure
│   │   │       └── PHASE_1_mvp/
│   │   │           └── paths/
│   │   │               └── path-1/
│   │   │                   ├── TIDE_1/   # First attempt
│   │   │                   │   ├── tide.yml
│   │   │                   │   ├── learnings.yml
│   │   │                   │   └── artifacts/
│   │   │                   ├── TIDE_2/   # Second attempt
│   │   │                   └── patterns/ # Extracted patterns
│   │   │
│   │   └── KNOWLEDGE/                     # Synthesized knowledge
│   │       ├── patterns/                  # Cross-project patterns
│   │       │   ├── technical/
│   │       │   ├── process/
│   │       │   └── business/
│   │       └── learnings/                 # Accumulated learnings
│   │           ├── by-phase/
│   │           ├── by-technology/
│   │           └── by-problem-type/
│   │
│   └── Monitoring-<project-name>/         # Monitoring & reports
│       ├── architecture-reviews/
│       ├── compliance-reports/
│       └── performance-metrics/
│
├── CLAUDE.md                               # Multi-session dispatcher
├── CLAUDE_*.md                             # Role-specific guides
├── CLAUDE_TODO_HISTORY.md                 # Completed tasks archive
├── docker-compose.yml                      # Docker configuration
├── package.json                            # Node.js dependencies
└── .gitignore                             # Git ignore rules
```

## Critical v5.1 Rules

### 1. PHASE Hierarchy (Most Important)
```
phases/
  PHASE_1_mvp.yml           # Phase definition
  PHASE_1_mvp/              # Phase folder (SAME name)
    paths/                  # PATHs MUST be under PHASE
      path-name.yml         # PATH definitions
```

### 2. WORKs are Shared Pool
```
BLUEPRINTs/
  works/                    # NOT under paths!
    work-1-v4.yml          # Reusable across ALL paths
```

### 3. EXECUTIONs Mirror BLUEPRINTs
```
BLUEPRINTs/phases/PHASE_1/paths/path-1.yml
         ↓ mirrors
EXECUTIONs/phases/PHASE_1/paths/path-1/TIDE_1/
```

## AI Execution Instructions (CRITICAL)

### When Creating a New PHASE:
```bash
# STEP 1: Define phase name (lowercase, underscores)
PHASE_NAME="phase_1_mvp"

# STEP 2: Create phase definition file
touch Docs/<project>/BLUEPRINTs/phases/${PHASE_NAME}.yml

# STEP 3: Create phase folder with EXACT SAME NAME
mkdir -p Docs/<project>/BLUEPRINTs/phases/${PHASE_NAME}/paths

# STEP 4: Create execution mirror
mkdir -p Docs/<project>/EXECUTIONs/phases/${PHASE_NAME}/paths

# VERIFY: Phase file and folder names MUST match exactly
```

### When Creating a New PATH:
```bash
# STEP 1: Identify parent phase
PHASE_NAME="phase_1_mvp"
PATH_NAME="kg4epic-mvp"  # lowercase, hyphens

# STEP 2: Create PATH under correct PHASE
touch Docs/<project>/BLUEPRINTs/phases/${PHASE_NAME}/paths/${PATH_NAME}.yml

# STEP 3: Create execution folder
mkdir -p Docs/<project>/EXECUTIONs/phases/${PHASE_NAME}/paths/${PATH_NAME}

# NEVER create PATHs directly under phases/ folder
```

### When Creating a New WORK:
```bash
# ALWAYS in shared pool, NEVER under a PATH
WORK_NAME="setup-docker-v4"  # verb-noun-version

# CORRECT: In shared pool
touch Docs/<project>/BLUEPRINTs/works/${WORK_NAME}.yml

# WRONG: Never do this
# touch Docs/<project>/BLUEPRINTs/phases/*/paths/works/${WORK_NAME}.yml
```

### When Starting a TIDE:
```bash
PHASE_NAME="phase_1_mvp"
PATH_NAME="kg4epic-mvp"
TIDE_NUM="1"

# Create TIDE folder in EXECUTIONs (not BLUEPRINTs)
mkdir -p Docs/<project>/EXECUTIONs/phases/${PHASE_NAME}/paths/${PATH_NAME}/TIDE_${TIDE_NUM}

# Create tide tracking file
touch Docs/<project>/EXECUTIONs/phases/${PHASE_NAME}/paths/${PATH_NAME}/TIDE_${TIDE_NUM}/tide.yml
```

### Validation Commands:
```bash
# CHECK 1: Every phase folder has matching .yml file
ls -la Docs/<project>/BLUEPRINTs/phases/ | grep "^d" | awk '{print $9}' | while read dir; do
  [ -f "Docs/<project>/BLUEPRINTs/phases/${dir}.yml" ] || echo "ERROR: Missing ${dir}.yml"
done

# CHECK 2: WORKs are ONLY in shared pool
find Docs/<project>/BLUEPRINTs -name "*.yml" -path "*/paths/*/works/*" && echo "ERROR: WORKs found under PATHs!"

# CHECK 3: EXECUTIONs structure matches BLUEPRINTs
diff <(find Docs/<project>/BLUEPRINTs/phases -type d | sed 's/BLUEPRINTs/EXECUTIONs/') \
     <(find Docs/<project>/EXECUTIONs/phases -type d)
```

## Folder Purposes

### `/src`
- Your actual application code
- Language/framework specific structure
- Not part of EPIC-TIDE methodology

### `/Docs/EPIC-TIDE-ADV`
- Methodology documentation
- Templates for creating new documents
- Shared across all projects
- Version controlled separately if needed

### `/Docs/<project-name>/BLUEPRINTs`
- **phases/**: Strategic scope boundaries
- **phases/PHASE_X/paths/**: Implementation approaches
- **works/**: Shared pool of reusable tasks

### `/Docs/<project-name>/EXECUTIONs`
- Tracks actual execution attempts
- Each TIDE creates a new folder
- Captures learnings and artifacts
- Structure MUST mirror BLUEPRINTs

### `/Docs/<project-name>/KNOWLEDGE`
- Synthesized learnings from TIDEs
- Extracted patterns for reuse
- Cross-project knowledge base

### `/Docs/Monitoring-<project-name>`
- Architecture review reports
- Compliance checks
- Performance metrics
- Separated from main project docs

## File Naming Conventions

### PHASE Files
```
PHASE_1_mvp.yml             # Lowercase with underscores
PHASE_2_enhanced.yml        # Descriptive suffix
```

### PATH Files
```
kg4epic-mvp.yml            # Lowercase with hyphens
semantic-search.yml        # Feature-descriptive names
```

### WORK Files
```
setup-nodejs-project-v4.yml    # Action-resource-version
implement-post-api-v4.yml      # Verb-noun pattern
```

### TIDE Folders
```
TIDE_1/                    # Sequential numbering
TIDE_2/                    # Capital TIDE prefix
```

## Common Mistakes to Avoid

### ❌ WRONG: Flat structure
```
BLUEPRINTs/
  phases/
  paths/        # PATHs as sibling to PHASEs
  works/
```

### ✅ CORRECT: Hierarchical structure
```
BLUEPRINTs/
  phases/
    PHASE_1/
      paths/    # PATHs nested under PHASE
  works/        # Separate shared pool
```

### ❌ WRONG: WORKs under PATHs
```
paths/
  path-1/
    works/      # WORKs owned by PATH
```

### ✅ CORRECT: WORKs in shared pool
```
BLUEPRINTs/
  works/        # All WORKs here
paths/
  path-1.yml    # References works from pool
```

### ❌ WRONG: Inconsistent execution structure
```
EXECUTIONs/
  tides/        # Different structure
    TIDE_1/
```

### ✅ CORRECT: Mirrored structure
```
EXECUTIONs/
  phases/       # Same as BLUEPRINTs
    PHASE_1/
      paths/
        path-1/
          TIDE_1/
```

## Evidence-Driven Progress Tracking

### No Time-Based Folders
Never create folders like:
- ❌ `/2024-Q1/`
- ❌ `/week-1/`
- ❌ `/january/`

### Evidence-Based Organization
Always organize by:
- ✅ `/PHASE_1_mvp/` (scope achieved)
- ✅ `/TIDE_1/` (attempt number)
- ✅ `/patterns/` (knowledge extracted)

## Migration from Older Structures

### From v3/v4 to v5.1
1. Create `phases/` folder under `BLUEPRINTs/`
2. Move PATHs under appropriate PHASE folders
3. Consolidate all WORKs to shared `works/` folder
4. Update PATH files to reference works from pool
5. Restructure EXECUTIONs to mirror new BLUEPRINTs

### Archive Strategy
```
archive/
  v3_structure/     # Old structure preserved
  v4_structure/     # For reference only
```

## Quick Setup Script

```bash
# Create v5.1 compliant structure for new project
PROJECT_NAME="my-project"

mkdir -p Docs/$PROJECT_NAME/BLUEPRINTs/phases
mkdir -p Docs/$PROJECT_NAME/BLUEPRINTs/works
mkdir -p Docs/$PROJECT_NAME/EXECUTIONs/phases
mkdir -p Docs/$PROJECT_NAME/KNOWLEDGE/patterns
mkdir -p Docs/$PROJECT_NAME/KNOWLEDGE/learnings
mkdir -p Docs/Monitoring-$PROJECT_NAME

echo "v5.1 structure created for $PROJECT_NAME"
```

## Validation Checklist

### Structure Compliance
- [ ] PHASEs have their own folders
- [ ] PATHs are under PHASE folders
- [ ] WORKs are in shared pool
- [ ] EXECUTIONs mirror BLUEPRINTs
- [ ] No time-based folder names

### File Compliance
- [ ] All documents use v5.1 templates
- [ ] No time/schedule references
- [ ] Evidence targets defined
- [ ] Self-contained with context

### Execution Compliance
- [ ] Each TIDE in separate folder
- [ ] Learnings captured in TIDE
- [ ] Patterns extracted to KNOWLEDGE
- [ ] No timeline tracking

## The Philosophy

> "The folder structure is not just organization—it's a physical manifestation of the EPIC-TIDE methodology. The hierarchy enforces proper thinking: PHASEs contain PATHs, PATHs execute TIDEs, while WORKs remain freely reusable components available to all."

## Summary

This standard structure ensures:
1. **Clear hierarchy** reflecting v5.1 methodology
2. **Reusable WORKs** through shared pool
3. **Evidence tracking** through TIDEs
4. **Knowledge accumulation** in dedicated areas
5. **No time dependencies** in organization

Follow this structure for all EPIC-TIDE projects to maintain consistency and enable cross-project learning.

---
*Version: v5.1 (2025-01-28)*  
*Key Principle: Structure reflects methodology—hierarchy for scope, pool for reuse*