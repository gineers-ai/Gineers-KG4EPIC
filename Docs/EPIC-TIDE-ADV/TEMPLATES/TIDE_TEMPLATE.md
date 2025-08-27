# TIDE Template - Actual Path Through Execution

## TIDE Identification
```yaml
tide_name: "TIDE_[N]_PATH_[Project_Name]"
attempt_number: N
path_reference: "PATH_[Project_Name]"  # Original blueprint
started_at: "[YYYY-MM-DD HH:MM]"
completed_at: "[YYYY-MM-DD HH:MM]"
outcome: "[success|partial|failed|in_progress]"
```

## WHAT: Execution Attempt Description
```yaml
WHAT: |
  [For TIDE_1]: "Pristine attempt following PATH_[Project] blueprint exactly"
  [For TIDE_2+]: "Evolved attempt based on TIDE_[N-1] learnings"
  [What specific adaptations this TIDE makes]
```

## PLANNED vs ACTUAL PATH
```yaml
PLANNED_PATH: PATH_[Project_Name]  # Reference to original blueprint

ACTUAL_PATH:  # The path ACTUALLY taken
  - WORK_Setup_Environment: ✅
  - WORK_Initialize_Database: ✅
  - WORK_Create_API_Endpoints: ❌ → WORK_Create_API_Endpoints_Fixed: ✅
  - WORK_Add_Authentication: ⏸️
  
  # Symbols:
  # ✅ = Completed successfully
  # ❌ = Failed (followed by → replacement if adapted)
  # ⏸️ = Blocked/Not attempted
  # 🔄 = In progress

PATH_DIVERGENCE:
  diverged: [true|false]
  divergence_point: "WORK_Create_API_Endpoints"
  reason: "Original WORK failed with connection pool exhaustion"
```

## MODIFICATIONS (For TIDE_2+ Only)
```yaml
MODIFICATIONS:
  # Document any WORKs that were modified or replaced
  
  WORK_Create_API_Endpoints_Fixed:
    based_on: "WORK_Create_API_Endpoints"
    type: "modified"  # modified|replaced|added
    
    # Embedded WORK modification (not separate file)
    WHAT: "Same as original"  # Usually unchanged
    HOW:  # Only HOW typically changes
      - "Original step 1"
      - "Modified step 2: Set connection pool to 20"  # Changed
      - "Original step 3"
    METRIC: "Same as original"  # Usually unchanged
    
    reason: "TIDE_1 showed connection pool exhaustion at default size 5"
    learning_from: "TIDE_1 failure at 45 minutes mark"
  
  WORK_Add_Logging:  # Example of completely new WORK
    based_on: null
    type: "added"
    WHAT: "Add comprehensive logging"
    HOW: ["Setup logger", "Add to all endpoints"]
    METRIC: [ ] "All requests logged"
    reason: "Debugging was difficult without logs in TIDE_1"
```

## METRIC: Evidence Collection
```yaml
METRIC:  # From original PATH
  [✅] Environment runs locally
  [✅] Database schema created
  [❌] All API endpoints working (2/5 failed initially, fixed in execution)
  [⏸️] Authentication implemented (blocked by API issues)
  [ ] All tests passing (not attempted)
  
Progress: 2/5 complete (40%)
Compared to TIDE_[N-1]: +15% progress
```

## EXECUTION LOG
```yaml
execution_log:
  - timestamp: "10:00"
    work: "WORK_Setup_Environment"
    action: "Started"
    result: "✅ Completed in 5 minutes"
    evidence: "Server running at localhost:3000"
  
  - timestamp: "10:05"
    work: "WORK_Initialize_Database"
    action: "Started"
    result: "✅ Completed in 3 minutes"
    evidence: "5 tables created, migrations applied"
  
  - timestamp: "10:08"
    work: "WORK_Create_API_Endpoints"
    action: "Started"
    result: "❌ Failed after 45 minutes"
    error: "Connection pool exhausted"
    learning: "Default pool size (5) insufficient"
  
  - timestamp: "10:53"
    work: "WORK_Create_API_Endpoints_Fixed"
    action: "Applied fix from learning"
    modification: "Increased pool size to 20"
    result: "✅ Completed in 10 minutes"
    evidence: "All endpoints responding correctly"
```

## LEARNINGS
```yaml
learnings:
  failures:
    - work: "WORK_Create_API_Endpoints"
      issue: "Database connection pool exhaustion"
      root_cause: "Default pool size too small for concurrent requests"
      fix: "Set pool size to 20 in connection config"
      time_to_discover: "30 minutes"
      time_to_fix: "10 minutes"
      
  discoveries:
    - "Connection pooling critical for API performance"
    - "Default configs often insufficient for production-like testing"
    - "Adding logging early saves debugging time"
    
  patterns:
    - "Always configure connection pools explicitly"
    - "Test with concurrent requests early"
    
  for_next_tide:  # Only if this TIDE didn't succeed
    - "Consider adding rate limiting"
    - "May need caching layer for heavy queries"
```

## REUSABLE COMPONENTS
```yaml
reusable_from_this_tide:
  successful_works:  # Can skip in TIDE_N+1
    - WORK_Setup_Environment
    - WORK_Initialize_Database
    - WORK_Create_API_Endpoints_Fixed  # The fixed version
  
  proven_modifications:
    - "Connection pool size = 20 for this stack"
    - "Logging configuration that worked"
```

## COMPARISON WITH BLUEPRINT
```yaml
blueprint_alignment:
  followed_blueprint: [true for TIDE_1 | false for TIDE_2+]
  deviations:
    - original: "WORK_Create_API_Endpoints"
      actual: "WORK_Create_API_Endpoints_Fixed"
      type: "modification"
      justified: true
      reason: "Original failed, fix required"
  
  blueprint_gaps:  # Things blueprint didn't account for
    - "Connection pooling configuration"
    - "Concurrent request handling"
    - "Logging for debugging"
```

## PATH EVOLUTION SUMMARY
```yaml
evolution:
  tide_1_path: "W1 → W2 → W3 → W4"
  tide_1_result: "W1✅ → W2✅ → W3❌ → W4⏸️"
  
  # Current TIDE (if TIDE_2+)
  tide_2_path: "W1 → W2 → W3_fixed → W4"
  tide_2_result: "W1✅ → W2✅ → W3_fixed✅ → W4✅"
  
  path_proven: true
  proven_path: "The actual sequence that worked"
```

## DECISION POINT
```yaml
decision:
  tide_outcome: "[success|partial|failed]"
  
  if_success:
    action: "Extract PROVEN_PATH"
    next: "Move to KNOWLEDGE/PROVEN_PATHs/"
  
  if_partial:
    action: "Create TIDE_[N+1]"
    carry_forward: ["Successful WORKs", "Proven modifications"]
    address: ["Remaining failures", "Blocked WORKs"]
  
  if_failed:
    action: "Major revision needed"
    consider: "New blueprint (PATH_v2) may be required"
```

## TIME ANALYSIS
```yaml
time_analysis:
  total_duration: "2 hours 15 minutes"
  breakdown:
    successful_works: "18 minutes"
    failed_attempts: "45 minutes"
    fixing_issues: "10 minutes"
    blocked_time: "1 hour 2 minutes"
  
  efficiency:
    vs_blueprint_estimate: "+50% longer"
    vs_previous_tide: "-30% (improvements working)"
```

---

## Summary Box
```yaml
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TIDE_[N]_PATH_[Project]: [outcome]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Planned: W1 → W2 → W3 → W4
Actual:  W1 → W2 → W3_fix → W4
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Progress: 4/4 WORKs ✅ | 5/5 METRICs ✅
Divergence: Yes - 1 WORK modified
Learning: Connection pooling critical
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next: Extract PROVEN_PATH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

*TIDE shows the ACTUAL PATH taken through execution, which may diverge from the blueprint to achieve success*