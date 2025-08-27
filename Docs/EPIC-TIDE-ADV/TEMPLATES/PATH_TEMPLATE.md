# PATH Template - Immutable Blueprint

## ⚠️ IMMUTABILITY WARNING
**Once created, this PATH must NEVER be modified. PATHs are blueprints that remain pristine.**
- If changes are needed, create PATH_v2
- TIDEs may diverge from PATH, but PATH itself stays unchanged
- This ensures we can always see original intent vs actual execution

## PATH Identification
```yaml
path_name: "PATH_[Project_Name]"
version: "1.0.0"
created_at: "[YYYY-MM-DD]"
immutable: true  # This document is frozen after creation
type: "[main|sub|feature|fix]"  # main PATH or nested sub-PATH
```

## WHAT: Project Goal
```yaml
WHAT: |
  [Clear description of what this PATH achieves]
  [The overall milestone or deliverable]
  [Business or technical value delivered]
```

## HOW: Work Sequence & Orchestration
```yaml
HOW:
  # Sequential execution (default)
  - WORK_Setup_Environment
  - WORK_Initialize_Database
  
  # Parallel execution
  - parallel:
      - WORK_Create_API_Endpoints
      - WORK_Setup_Frontend_Framework
  
  # Nested PATH (for complex milestones)
  - PATH_Authentication_System:
      - WORK_Setup_Auth_Database
      - WORK_Implement_JWT
      - WORK_Create_Login_API
  
  # More sequential work
  - WORK_Integration_Tests
  
  # Conditional execution (optional advanced feature)
  - conditional:
      if: "WORK_Integration_Tests.metric[0] == true"
      then: WORK_Deploy_Production
      else: WORK_Fix_Issues
```

## METRIC: Success Criteria
```yaml
METRIC:
  [ ] [Major milestone 1 achieved]
  [ ] [Major milestone 2 achieved]
  [ ]+ [Major milestone 3 achieved]
  [ ] [System fully operational]
  [ ] [All acceptance criteria met]
  # These are high-level success indicators
  # Checked off when underlying WORKs complete
```

## Evidence Gates
```yaml
gates:
  GATE_1_Foundation:
    after: [WORK_Setup_Environment, WORK_Initialize_Database]
    evidence_required:
      - "Environment accessible at localhost"
      - "Database schema applied successfully"
    unlocks: "API development can begin"
  
  GATE_2_Integration:
    after: [WORK_Create_API_Endpoints, WORK_Setup_Frontend_Framework]
    evidence_required:
      - "All API endpoints return 200"
      - "Frontend builds without errors"
    unlocks: "Integration testing can begin"
  
  GATE_FINAL:
    after: [WORK_Integration_Tests]
    evidence_required:
      - "All tests pass"
      - "Performance metrics met"
    unlocks: "PATH PROVEN - Ready for production"
```

## Dependencies & Requirements
```yaml
requires:
  external:
    - "Docker installed"
    - "Node.js >= 18"
    - "PostgreSQL available"
  knowledge:
    - "Understanding of REST APIs"
    - "Basic TypeScript knowledge"
```

## Risk Management
```yaml
risks:
  - risk: "Database connection issues"
    likelihood: "medium"
    mitigation: "Use connection pooling, add retry logic"
  - risk: "API rate limiting needed"
    likelihood: "high"  
    mitigation: "Implement from start, not retrofitted"
```

## Decomposition Notes
```yaml
decomposition:
  # How this PATH breaks down
  total_works: 8
  can_parallelize: 3
  critical_path: 5  # Minimum sequential WORKs
  estimated_tides: "1-3"  # Typical attempts needed
```

## Reusability
```yaml
reusable_for:
  - "Any web application with API + Frontend"
  - "Microservice architectures"
  - "CRUD applications"
patterns_extractable:
  - "Authentication flow"
  - "API structure"
  - "Database setup"
```

## TIDE Expectations
```yaml
tide_patterns:
  TIDE_1:
    behavior: "Will follow this PATH exactly as written"
    typical_issues:
      - "Environment configuration errors"
      - "Missing dependencies"
    success_rate: "40%"
  
  TIDE_2:
    behavior: "May diverge from PATH based on TIDE_1 learnings"
    typical_issues:
      - "Integration failures"
      - "Performance bottlenecks"
    success_rate: "80%"
  
  TIDE_3:
    behavior: "Further refinement of execution path"
    typical_issues:
      - "Edge cases"
    success_rate: "95%"
```

## Blueprint Preservation
```yaml
preservation_rules:
  - "This PATH represents the original plan"
  - "TIDE_1 will execute this exactly"
  - "TIDE_2+ may adapt but PATH remains unchanged"
  - "Successful TIDE becomes PROVEN_PATH"
  - "This document is historical record of intent"
```

---

*PATH is the immutable blueprint - it defines the intended journey*
*TIDEs show the actual paths taken during execution*
*Successful TIDEs become PROVEN_PATHs for future reuse*