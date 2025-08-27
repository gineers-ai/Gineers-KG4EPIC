# WORK Template

## WORK Identification
```yaml
work_name: "WORK_[Description]_PATH_[Project]"
version: "1.0.0"
created_at: "[YYYY-MM-DD]"
reusable: true  # WORKs are pure and reusable across projects
```

## WHAT: Goal of this WORK
```yaml
WHAT: |
  [Clear description of what this WORK achieves]
  [This should be project-agnostic and focused on the outcome]
```

## HOW: Steps to Execute
```yaml
HOW:
  - Step 1: [First action with specific details]
  - Step 2: [Second action with specific details]
  - Step 3: [Third action with specific details]
  # Steps should be atomic and verifiable
```

## METRIC: Success Criteria
```yaml
METRIC:
  [ ] [Measurable outcome 1]
  [ ] [Measurable outcome 2]
  [ ] [Measurable outcome 3]
  # Each metric must be objectively verifiable
  # Check these off during TIDE execution
```

## Input Requirements
```yaml
requires:
  - [Resource or configuration needed]
  - [Tool or service that must be available]
  - [Data or file that must exist]
```

## Output Deliverables
```yaml
produces:
  - [File, service, or state created]
  - [Configuration or data generated]
  - [Side effect or system change]
```

## Tools & Technologies
```yaml
tools:
  - [Technology/framework used]
  - [Command-line tool required]
  - [Service dependency]
```

## Error Patterns
```yaml
common_errors:
  - error: "[Known failure mode]"
    solution: "[How to resolve]"
  - error: "[Another common issue]"
    solution: "[Fix approach]"
```

## Reusability Notes
```yaml
reusable_in:
  - "Web API projects"
  - "Microservice architectures"
  - "CRUD applications"
  # Describe contexts where this WORK applies
```

## Example Usage in Different PATHs
```yaml
examples:
  - PATH: "PATH_Blog_Platform"
    sequence: "After database, before API"
  - PATH: "PATH_E_Commerce"
    sequence: "Parallel with frontend setup"
```

---

*WORK is pure and contains NO project-specific triggers or dependencies - those belong in PATH*