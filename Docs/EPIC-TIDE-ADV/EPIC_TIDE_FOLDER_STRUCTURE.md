# EPIC-TIDE Folder Structure

## Core Principle: Blueprints vs Actual Execution Paths

- **BLUEPRINTs**: Immutable plans (PATHs and WORKs never change)
- **EXECUTIONs**: Actual paths taken (TIDEs show what really happened)
- **KNOWLEDGE**: Proven patterns extracted from successful TIDEs

## Recommended Structure (Simplified Embedded Approach)

```
<project_root>/
├── Docs/
│   └── {project_name}/
│       ├── BLUEPRINTs/              # Immutable plans
│       │   ├── PATHs/
│       │   │   └── PATH_{project}.md         # Original blueprint
│       │   └── WORKs/
│       │       ├── WORK_{task}_PATH_{project}.md
│       │       └── WORK_{another}_PATH_{project}.md
│       │
│       ├── EXECUTIONs/              # Actual paths taken
│       │   └── TIDEs/
│       │       ├── TIDE_1_PATH_{project}.md  # Pristine attempt
│       │       ├── TIDE_2_PATH_{project}.md  # Evolved path
│       │       └── TIDE_3_PATH_{project}.md  # Further evolution
│       │
│       └── KNOWLEDGE/               # Extracted patterns
│           ├── PROVEN_PATHs/
│           │   └── PROVEN_PATH_{project}.md  # What actually worked
│           ├── WORK_PATTERNs/
│           │   └── PATTERN_{common_fix}.md   # Reusable fixes
│           └── TROUBLESHOOTINGs/
│               └── TROUBLESHOOTING_{issue}.md
│
├── src/                             # Actual code
├── tests/                          # Test files
└── ...                            # Other project files
```

## Key Concept: TIDE as Actual Path Through

### TIDE_1: Pristine Blueprint Copy
```yaml
# TIDE_1 is ALWAYS exact copy of blueprint
TIDE_1_PATH_Blog:
  PLANNED_PATH: PATH_Blog  # Original blueprint
  ACTUAL_PATH: 
    - WORK_Database_Setup  # Follows blueprint exactly
    - WORK_API_Creation
    - WORK_Frontend_Setup
  # No modifications in TIDE_1 - pure test of plan
```

### TIDE_2+: Evolution Based on Learning
```yaml
# TIDE_2+ can diverge from blueprint
TIDE_2_PATH_Blog:
  PLANNED_PATH: PATH_Blog  # Still references original
  ACTUAL_PATH:
    - WORK_Database_Setup ✅ (reused from TIDE_1)
    - WORK_API_Creation_Fixed ✅ (modified based on TIDE_1 failure)
    - WORK_Frontend_Setup ✅
  
  MODIFICATIONS:
    WORK_API_Creation_Fixed:
      based_on: WORK_API_Creation
      changes: "Added connection pooling"
      learning_from: TIDE_1_failure
```

## Document Structure (Embedded Approach)

### Single TIDE File Contains Everything
```yaml
# Instead of copying all WORKs to TIDE folders:
TIDE_2_PATH_{project}.md:
  PLANNED_PATH: PATH_1
  ACTUAL_PATH:
    - WORK_1: {status: ✅, evidence: "completed"}
    - WORK_2: {status: ✅, evidence: "completed"}
    - WORK_3_fixed: {status: ✅, evidence: "fixed pool size"}
    - WORK_4: {status: ✅, evidence: "completed"}
  
  MODIFICATIONS:  # Embedded changes, not separate files
    WORK_3_fixed:
      WHAT: "Same as WORK_3"
      HOW: ["Modified step 2: Set pool=20"]  # Only HOW changes
      METRIC: "Same as WORK_3"
  
  # One file tracks entire execution path
```

## Evolution Examples

### Case 1: Same Blueprint, Fixed Execution
```
Blueprint: W1 → W2 → W3 → W4
TIDE_1:    W1✅ → W2✅ → W3❌ → W4⏸️
TIDE_2:    W1✅ → W2✅ → W3_fixed✅ → W4✅
Result:    PATH proven with minor modification
```

### Case 2: Different Path Needed
```
Blueprint: W1 → W2 → W3 → W4
TIDE_1:    W1✅ → W2✅ → W3❌ → W4⏸️
TIDE_2:    W1✅ → W2✅ → W5✅ → W4✅  # W3 replaced entirely
Result:    PATH proven via different route
```

## Blueprint Immutability Rules

### BLUEPRINTs Never Change
```yaml
# ❌ WRONG: Don't modify blueprint
BLUEPRINTs/PATHs/PATH_Blog.md  # NEVER edit after creation

# ✅ CORRECT: Create new version if needed
BLUEPRINTs/PATHs/PATH_Blog_v2.md  # New blueprint based on learnings
```

### WORKs Remain Pure
```yaml
# Original WORK stays unchanged
BLUEPRINTs/WORKs/WORK_Database_Setup.md  # Immutable

# Modifications exist only in TIDEs
TIDE_2: 
  MODIFICATIONS:
    WORK_Database_Setup_Fixed:  # Embedded in TIDE
      HOW: ["Added pool configuration"]
```

## Knowledge Synthesis

### From Successful TIDE to PROVEN_PATH
```yaml
# After TIDE_2 succeeds:
KNOWLEDGE/PROVEN_PATHs/PROVEN_PATH_Blog.md:
  derived_from: TIDE_2_PATH_Blog
  actual_working_path:
    - WORK_Database_Setup
    - WORK_API_Creation_Fixed  # The fix that worked
    - WORK_Frontend_Setup
  
  # This becomes the reusable pattern
```

### Pattern Extraction
```yaml
# After multiple similar fixes:
KNOWLEDGE/WORK_PATTERNs/PATTERN_Connection_Pool_Fix.md:
  problem: "Database connection exhaustion"
  solution: "Set pool size to 20+ connections"
  seen_in:
    - TIDE_2_PATH_Blog
    - TIDE_3_PATH_E_Commerce
    - TIDE_2_PATH_API_Service
```

## Benefits of This Structure

### 1. No File Explosion
- Single TIDE file per attempt (not folder of copies)
- Modifications embedded, not separate files
- Clean, manageable structure

### 2. Clear Evolution Tracking
- TIDE_1: Always pristine blueprint test
- TIDE_2+: Shows exact divergence
- Easy to see how plan became reality

### 3. Blueprint Integrity
- Original plans remain untouched
- Clear separation of intent vs execution
- Can always reference original vision

### 4. Knowledge Capture
- Successful TIDEs → PROVEN_PATHs
- Common fixes → WORK_PATTERNs
- Failed attempts → TROUBLESHOOTINGs

## Migration from Old Structure

### From CONTRACT/ROUTE/TIDE to WORK/PATH/TIDE
```bash
# Old: Separate CONTRACT/ROUTE with status tracking
CONTRACTs/CONTRACT_001.md
ROUTEs/ROUTE_001.md
TIDEs/TIDE_1.md (status only)

# New: Blueprint vs Execution with path evolution
BLUEPRINTs/PATHs/PATH_1.md (immutable)
BLUEPRINTs/WORKs/WORK_*.md (immutable)
EXECUTIONs/TIDEs/TIDE_1_PATH_1.md (actual path taken)
KNOWLEDGE/PROVEN_PATHs/PROVEN_PATH_1.md (what worked)
```

## Quick Reference

### Document Types
1. **PATH**: Immutable blueprint of intended sequence
2. **WORK**: Pure, reusable task blueprint
3. **TIDE**: Actual path taken during execution (can diverge)
4. **PROVEN_PATH**: Successful execution path for reuse
5. **PATTERN**: Extracted common solutions

### Key Rules
- TIDE_1 = Always exact blueprint copy
- TIDE_2+ = Can diverge based on learnings
- BLUEPRINTs = Never modify after creation
- Successful TIDE = Becomes PROVEN_PATH
- Modifications = Embedded in TIDE, not separate files

---

*This structure shows the evolution from blueprint to working system through actual execution paths*