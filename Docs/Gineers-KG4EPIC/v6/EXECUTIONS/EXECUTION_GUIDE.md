# EXECUTION Guide for v6

## What is an EXECUTION?

An EXECUTION tracks your actual implementation of a BLUEPRINT. Each attempt at completing the BLUEPRINT gets a new EXECUTION file.

## File Naming Convention

```
execution_1.yml   # First attempt
execution_2.yml   # Second attempt (if first failed/partial)
execution_3.yml   # Third attempt (continue until success)
```

## How to Start

1. **Copy EXECUTION_TEMPLATE.yml** to `execution_1.yml`
2. **Reference your BLUEPRINT**: Set `blueprint_ref:` to match BLUEPRINT id
3. **List all works**: Copy work names from BLUEPRINT.works
4. **Begin execution**: Update status as you complete works

## EXECUTION Structure

```yaml
EXECUTION:
  # IDENTIFICATION
  id: "execution_[number]"
  blueprint_ref: "[blueprint_id]"
  attempt: [number]
  previous: "execution_[n-1]"  # Link to prior attempt (if any)
  
  # TRACKING
  started: "[timestamp]"
  status: "in_progress|success|partial|failed"
  
  # WORK ATTEMPTS - Mirror BLUEPRINT.works structure
  attempts:
    [work_name]:  # Must match BLUEPRINT work names exactly
      status: "not_started|in_progress|complete|failed|blocked"
      
      # What you did (optional, but recommended)
      actions:
        - "Step 1 taken"
        - "Step 2 taken"
      
      # Evidence (REQUIRED for complete status)
      artifacts:  # Free format - organize as needed
        - "path/to/created/file.ext"
        - "logs/output.log"
        - "screenshots/proof.png"
      
      # If failed/blocked (REQUIRED for failed status)
      error: "What went wrong"
      attempted_fixes:
        - "Tried X"
        - "Tried Y"
      
      # If blocked (REQUIRED for blocked status)
      blocker: "[work_name that must complete first]"
  
  # VALIDATION - Prove constraints were followed
  constraints_validated:
    [constraint_category]:  # From BLUEPRINT.constraints
      [specific_constraint]: "✓ Met | ✗ Not met | - Not applicable"
  
  # RESULTS - Show success criteria achievement
  criteria_results:
    [criteria_category]:  # From BLUEPRINT.success_criteria
      - "✓ Criterion met with evidence"
      - "✗ Criterion not met"
      - "- Not measured yet"
  
  # LEARNINGS - Knowledge gained
  learnings:
    technical:
      - "Discovery about implementation"
    architectural:
      - "Design insight"
    process:
      - "Workflow improvement"
  
  # COMPLETION
  completed: "[timestamp or null]"
  outcome: "success|partial|failed"
  
  # NEXT STEPS (if not success)
  next_execution:
    focus: "What to fix/complete in next attempt"
    blockers: ["What's preventing progress"]
```

## Status Values Explained

### Work Status:
- `not_started`: Haven't begun this work
- `in_progress`: Currently working on it
- `complete`: Successfully finished with evidence
- `failed`: Attempted but couldn't complete
- `blocked`: Can't start due to dependency

### Overall Status:
- `in_progress`: Currently executing
- `success`: All works complete, criteria met
- `partial`: Some works complete, some remain
- `failed`: Cannot complete, needs new approach

## Iteration Pattern

### First Attempt (execution_1.yml):
```yaml
EXECUTION:
  id: "execution_1"
  blueprint_ref: "kg4epic_phase2_enhanced"
  attempt: 1
  # No 'previous' field for first attempt
```

### Second Attempt (execution_2.yml):
```yaml
EXECUTION:
  id: "execution_2"
  blueprint_ref: "kg4epic_phase2_enhanced"
  attempt: 2
  previous: "execution_1"  # Links to prior attempt
  # Continue from where execution_1 left off
```

## Evidence Requirements

Each completed work MUST have artifacts as evidence:

```yaml
artifacts:
  # Option 1: Simple list
  - "src/newFile.ts"
  - "test/newFile.test.ts"
  
  # Option 2: Categorized (recommended)
  created:
    - "src/newFile.ts"
  tested:
    - "test/newFile.test.ts"
  verified:
    - "logs/test-pass.log"
    - "screenshots/working.png"
```

## Example: Starting PHASE_2 Execution

1. Copy template:
```bash
cp EXECUTION_TEMPLATE.yml execution_1.yml
```

2. Update with PHASE_2 works:
```yaml
EXECUTION:
  id: "execution_1"
  blueprint_ref: "kg4epic_phase2_enhanced"
  attempt: 1
  started: "2025-01-29T10:00:00Z"
  status: "in_progress"
  
  attempts:
    # Copy all 20 work names from BLUEPRINT
    prepare_ada002_integration:
      status: "not_started"
    create_ada002_service:
      status: "not_started"
    # ... all other works ...
```

3. As you work, update status and add artifacts:
```yaml
prepare_ada002_integration:
  status: "complete"
  actions:
    - "Added OPENAI_API_KEY to .env"
    - "Configured rate limiting"
  artifacts:
    - ".env"
    - "src/config/openai.ts"
```

## Key Principles

1. **Evidence-Driven**: No work is complete without artifacts
2. **Iterative**: Multiple EXECUTIONs until success
3. **Flat Structure**: All EXECUTIONs at root level (no subfolders)
4. **Progressive**: Each EXECUTION builds on previous
5. **Traceable**: Clear links between attempts

## Common Patterns

### Pattern 1: Linear Progress
```
execution_1: Works 1-5 complete
execution_2: Works 6-10 complete
execution_3: Works 11-20 complete → SUCCESS
```

### Pattern 2: Fix and Retry
```
execution_1: Work 3 failed
execution_2: Fixed work 3, continue
execution_3: All complete → SUCCESS
```

### Pattern 3: Parallel Work
```
execution_1: Start all 3 paths simultaneously
execution_2: Continue all paths
execution_3: Merge and complete → SUCCESS
```

## Tips for AI Agents

1. **Always check previous executions** before starting new one
2. **Copy work names exactly** from BLUEPRINT
3. **Generate real artifacts** - don't just claim completion
4. **Update incrementally** - save progress frequently
5. **Link artifacts** to specific works for traceability

## Questions to Answer

Before marking work complete:
- [ ] Have I generated artifacts?
- [ ] Do artifacts prove the verification criteria?
- [ ] Have I updated constraints_validated?
- [ ] Have I documented learnings?

Before creating new execution:
- [ ] Have I reviewed previous execution?
- [ ] Do I understand what failed/blocked?
- [ ] Am I continuing from the right point?

## Next Steps

1. Read the BLUEPRINT: `BLUEPRINTS/kg4epic_enhanced.yml`
2. Check for existing executions: `ls EXECUTIONS/`
3. Create or continue execution
4. Generate artifacts as evidence
5. Update execution file with results