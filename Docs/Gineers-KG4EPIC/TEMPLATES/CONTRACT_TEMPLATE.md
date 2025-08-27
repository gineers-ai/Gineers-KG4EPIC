# CONTRACT: [CONTRACT_ID]

## CONTRACT Metadata

```yaml
contract_id: "CONTRACT_[NUMBER]_[SHORT_NAME]"
contract_version: "1.0.0"
contract_type: "[setup|implementation|validation|fix]"
created_by: "[Terminal-X-role]"
created_at: "[YYYY-MM-DD]"
parent_route: "[ROUTE_ID]"
```

## What To Build

```yaml
what: "[Clear description of WHAT needs to be built]"
```

## How To Build

```yaml
how: |
  [Step-by-step instructions HOW to build it]
  1. First step
  2. Second step
  3. Third step
```

## Evidence Required

```yaml
evidence_required:
  - "[Specific measurable evidence 1]"
  - "[Specific measurable evidence 2]"
  - "[Specific measurable evidence 3]"
```

## Dependencies

```yaml
depends_on:
  - "[CONTRACT_ID that must complete first]"
  - "[Another CONTRACT_ID if needed]"
```

## Triggers Next

```yaml
triggers_next:
  - "[CONTRACT_ID to trigger on success]"
  - "[Another CONTRACT_ID if parallel]"
```

## Implementation Details

### Input
```yaml
input:
  - "[What this CONTRACT needs as input]"
  - "[Configuration or data required]"
```

### Output
```yaml
output:
  - "[What this CONTRACT produces]"
  - "[Files, services, or state changes]"
```

### Tools/Technologies
```yaml
tools:
  - "[Technology 1]"
  - "[Technology 2]"
```

## Validation

```yaml
validation_steps:
  - step: "[How to verify evidence 1]"
    expected: "[Expected result]"
  - step: "[How to verify evidence 2]"
    expected: "[Expected result]"
```

## Error Handling

```yaml
known_issues:
  - issue: "[Potential problem]"
    solution: "[How to fix it]"
  - issue: "[Another potential problem]"
    solution: "[How to fix it]"
```

## Learning Preservation

```yaml
learnings:
  - "[Key learning from this CONTRACT]"
  - "[Pattern to remember]"
  - "[Pitfall to avoid]"
```

---

*CONTRACT Status: [pending|in_progress|completed|failed]*