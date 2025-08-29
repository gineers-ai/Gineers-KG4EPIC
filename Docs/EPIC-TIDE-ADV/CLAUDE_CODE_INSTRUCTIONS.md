# Claude Code Instructions for EPIC-TIDE

## Overview
You are Claude Code working with the EPIC-TIDE knowledge system. This document defines how you should interact with the system.

## Core Principles

1. **You generate SEMANTIC content only**
   - WHAT, HOW, METRICS (meanings)
   - Status values from vocabulary
   - Learnings and adaptations

2. **Server generates SYSTEM fields**
   - IDs, timestamps, attempts
   - You NEVER create these

3. **Follow the vocabulary STRICTLY**
   - Use only approved status values
   - Use only approved outcome values
   - Follow naming patterns

## Workflow Instructions

### When Creating a WORK

```yaml
# YOU provide:
what: "Clear description of goal"
how: 
  - "Specific step 1"
  - "Specific step 2"
metrics:
  - "Measurable outcome"

# Server adds: work_id, created_at
```

**Rules:**
- Keep "what" under 200 characters
- Keep "how" steps actionable and specific
- Keep "metrics" measurable and verifiable
- Use lowercase-hyphenated names when referencing

### When Creating a PATH

```yaml
# YOU provide:
what: "Project goal"
works:
  - "setup-environment"  # Use work NAMES not IDs
  - "create-database"
metrics:
  - "System operational"

# Server adds: path_id, created_at
```

**Rules:**
- Reference works by NAME (setup-database) not ID
- Ensure all referenced works exist first
- List works in execution order
- Metrics should be project-level, not work-level

### When Executing a TIDE

#### Starting TIDE
```yaml
# For TIDE 1: No adaptations
path_name: "user-api"

# For TIDE 2+: Include adaptations
path_name: "user-api"
adaptations:
  - action: "insert"
    target: "add-auth"
    details:
      position: "before"
      relative_to: "create-api"
```

#### Updating Execution
```yaml
# As you execute each work:
work_name: "setup-environment"
status: "complete"  # MUST be: complete|failed|blocked|reused
output: "Environment ready at localhost:3000"

# If failed:
status: "failed"
error: "Connection refused on port 5432"
```

#### Completing TIDE
```yaml
outcome: "success"  # MUST be: success|partial|failed
metrics_achieved:
  "API running": true
  "Tests pass": true
learnings: "Actionable insight about what happened"
```

## Status Value Usage

### Work Execution Status

**complete**: Work finished successfully
```yaml
status: "complete"
output: "Database created with 5 tables"
```

**failed**: Work encountered error
```yaml
status: "failed"
error: "Connection pool exhausted"
```

**blocked**: Work cannot proceed due to dependency
```yaml
status: "blocked"
# Automatically set when previous work failed
```

**reused**: Using result from previous TIDE
```yaml
status: "reused"
# Only in TIDE 2+ for works that succeeded in TIDE 1
```

### TIDE Outcome

**success**: All metrics achieved
```yaml
outcome: "success"
# All works complete, all metrics true
```

**partial**: Some progress made
```yaml
outcome: "partial"
# Some works complete, some metrics true
```

**failed**: Critical failure, no progress
```yaml
outcome: "failed"
# Early failure preventing any progress
```

## Adaptation Patterns

### Insert New Work
```yaml
action: "insert"
target: "new-work-name"
details:
  position: "before"  # or "after"
  relative_to: "existing-work"
  reason: "Why this is needed"
```

### Modify Existing Work
```yaml
action: "modify"
target: "existing-work"
details:
  change: "Increase connection pool to 20"
  reason: "Default pool size caused failures"
```

### Remove Work
```yaml
action: "remove"
target: "work-to-remove"
details:
  reason: "Not needed for this context"
```

### Reorder Works
```yaml
action: "reorder"
target: "work-to-move"
details:
  new_position: "before"
  relative_to: "other-work"
  reason: "Dependency requirement"
```

## Learning Capture

Good learnings are:
- **Specific**: "JWT library must be installed before auth middleware"
- **Actionable**: "Increase connection pool size to 20 for production load"
- **Causal**: "Failed because X, fixed by doing Y"

Bad learnings are:
- **Vague**: "Something went wrong"
- **Obvious**: "Errors should be fixed"
- **Non-actionable**: "System is complex"

## Pattern Recognition

When you see repeated failures, suggest pattern extraction:

```yaml
# After 3+ similar projects succeed with same adaptation:
"This adaptation (auth before API) has worked in 3 projects.
Consider extracting as pattern."
```

## Error Handling

When MCP tool returns error:
```json
{
  "error": {
    "code": "INVALID_STATUS",
    "message": "Status must be one of: complete, failed, blocked, reused"
  }
}
```

You should:
1. Acknowledge the error
2. Correct the value using vocabulary
3. Retry the operation

## DO NOT

1. **Generate IDs**: Never create work_id, path_id, tide_id
2. **Set timestamps**: Never provide created_at, updated_at
3. **Calculate attempts**: Never determine attempt numbers
4. **Invent statuses**: Only use vocabulary values
5. **Mix concerns**: Keep semantic and system fields separate

## Conversational Style

When discussing EPIC-TIDE:
- "I'll create a WORK for database setup" ✓
- "I'll generate work_id_123" ✗
- "The setup-environment work is complete" ✓  
- "Work ID work_2024_01_15_a7f3 is done" ✗
- "This TIDE failed, let me check the learnings" ✓
- "TIDE attempt #3 with ID tide_xyz" ✗

## Testing Your Understanding

Before interacting with EPIC-TIDE, verify:
1. Am I using vocabulary values?
2. Am I providing semantic fields only?
3. Am I letting server generate IDs?
4. Are my learnings actionable?
5. Are my work names lowercase-hyphenated?

## Example Conversation

```
User: "Create a work for setting up the database"

Claude Code: "I'll create a WORK for database setup in EPIC-TIDE:

what: Initialize PostgreSQL database
how:
  - Create database schema
  - Run migration scripts  
  - Create required indexes
  - Seed initial test data
metrics:
  - Database connection successful
  - All tables created
  - Test query returns data

Calling epic-tide-save-work tool..."

[MCP returns: work_id: "work_2024_01_15_a7f3"]

Claude Code: "Created work successfully. The setup-database work is now available for use in PATHs."
```

Note how Claude Code:
- Provides semantic content
- Doesn't mention the work_id
- Uses the work name for reference
- Follows vocabulary strictly