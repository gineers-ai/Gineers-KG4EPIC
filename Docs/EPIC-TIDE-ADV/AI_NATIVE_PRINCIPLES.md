# AI-Native Principles for EPIC-TIDE

## The Fundamental Shift

### Traditional Documentation
```
Documentation → Separate from execution
Context → Centralized in README/CLAUDE.md
Learning → Lost after execution
Updates → Manual maintenance
```

### AI-Native Documentation
```
Documentation → Embedded in execution units
Context → Distributed where needed
Learning → Automatically captured and preserved
Updates → Self-maintaining through execution
```

## Core Principles

### 1. Context Locality Principle
> "Context should live where it's needed, not in a central file"

```yaml
# Bad: Central context file
CLAUDE.md:
  - Database is PostgreSQL
  - API uses POST only
  - Docker stack name is X
  
# Good: Context in execution unit
WORK:
  context:
    database: PostgreSQL with pgvector
    api_pattern: POST-only for security
    docker_stack: gineers-kg4epic
```

### 2. Progressive Disclosure Principle
> "AI agents should load only the information needed for current task"

```yaml
Information Hierarchy:
  Level 1: PATH → Project overview
  Level 2: WORK → Task details
  Level 3: Artifacts → Implementation
  Level 4: Troubleshooting → Problem solving
```

### 3. Learning Accumulation Principle
> "Every execution should make the documents smarter"

```yaml
TIDE_1 → Discovers issue → Updates WORK.troubleshooting
TIDE_2 → Finds optimization → Updates WORK.learnings
TIDE_3 → Identifies pattern → Creates PATTERN document
```

### 4. Self-Containment Principle
> "Each document should be executable without external references"

```yaml
WORK must contain:
  - Context (where, what prerequisites)
  - Knowledge (critical information)
  - Implementation (artifacts)
  - Experience (learnings, troubleshooting)
```

## Implementation Patterns

### Pattern 1: Enriched PATH for Project Context
```yaml
PATH:
  project:        # Full project context
  decisions:      # Architectural choices
  learnings:      # Accumulated wisdom
  for_new_session: # Bootstrap instructions
```

### Pattern 2: Enriched WORK for Task Context
```yaml
WORK:
  context:        # Task environment
  knowledge:      # Required information
  artifacts:      # Implementation
  troubleshooting: # Known issues
```

### Pattern 3: Learning Feedback Loop
```yaml
TIDE.learnings.for_work → Updates → WORK.learnings
TIDE.learnings.for_path → Updates → PATH.learnings
Multiple similar learnings → Creates → PATTERN
```

### Pattern 4: Minimal Bootstrap
```yaml
CLAUDE.md (30 lines):
  - Points to primary PATH
  - Git instructions
  - Nothing else
```

## Benefits for AI Agents

### 1. Faster Context Acquisition
- No reading 200+ line context files
- Load only relevant information
- Context travels with work

### 2. Better Execution
- All needed information in one place
- No searching for external docs
- Implementation details included

### 3. Continuous Improvement
- Documents get smarter with use
- Failures become troubleshooting guides
- Success becomes patterns

### 4. Session Resilience
- New sessions can start immediately
- No context reconstruction needed
- Learning preserved across sessions

## Anti-Patterns to Avoid

### Anti-Pattern 1: Separate Context Files
```yaml
# Bad
CLAUDE.md → All context
README.md → More context
SETUP.md → Even more context

# Good
PATH.yml → Contains all project context
```

### Anti-Pattern 2: External References
```yaml
# Bad
WORK:
  how: "See DATABASE_SETUP.md for details"

# Good
WORK:
  artifacts:
    setup_sql: |
      CREATE TABLE ...
```

### Anti-Pattern 3: Lost Learning
```yaml
# Bad
TIDE fails → Learning discussed in chat → Lost

# Good
TIDE fails → Learning captured → Added to WORK
```

### Anti-Pattern 4: Static Documentation
```yaml
# Bad
Documentation written once → Never updated

# Good
Documentation enriched with each execution
```

## Migration Strategy

### From Traditional to AI-Native

#### Step 1: Identify Primary PATH
The main entry point for your project

#### Step 2: Enrich Primary PATH
Add: project, decisions, learnings, for_new_session

#### Step 3: Enrich Critical WORKs
Add: context, knowledge, artifacts, troubleshooting

#### Step 4: Minimize Bootstrap File
Reduce CLAUDE.md to <50 lines

#### Step 5: Test with New Session
Verify AI can work from PATH alone

## The Philosophical Foundation

> "In an AI-native world, documentation isn't something you read before working - it's the work itself, carrying all context, learning from experience, and guiding execution autonomously."

## Practical Example

### Traditional Approach:
```
1. Read CLAUDE.md (200 lines)
2. Read README.md (100 lines)
3. Read SETUP.md (150 lines)
4. Find the actual work to do
5. Look up how to do it
6. Execute
7. Learnings lost in chat
```

### AI-Native Approach:
```
1. Read minimal CLAUDE.md → "Start with PATH"
2. Read PATH → Get all project context
3. Read specific WORK → Get everything needed
4. Execute with full context
5. Update WORK/PATH with learnings
6. Next session starts smarter
```

## Metrics of Success

Your EPIC-TIDE implementation is AI-native when:
- ✅ New AI session can start work within 2 prompts
- ✅ No external documentation lookups needed
- ✅ Each TIDE makes documents smarter
- ✅ WORKs are self-contained execution units
- ✅ Context loads progressively as needed

## Conclusion

AI-native EPIC-TIDE treats documents as:
- **Execution units** not documentation
- **Living artifacts** not static files
- **Knowledge containers** not descriptions
- **Self-improving systems** not fixed blueprints

This is the future of AI-assisted development.