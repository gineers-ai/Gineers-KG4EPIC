# CONTRACT: CONTRACT_008_LEARNING_EXTRACTION

## CONTRACT Metadata

```yaml
contract_id: "CONTRACT_008_LEARNING_EXTRACTION"
contract_version: "1.0.0"
contract_type: "validation"
created_by: "Terminal-1-architect"
created_at: "2025-01-25"
parent_route: "ROUTE_GINEERS_KG_POC1_001"
```

## What To Build

```yaml
what: "Learning extraction system from TIDE history showing improvement patterns"
```

## How To Build

```yaml
how: |
  1. Create API endpoint to analyze TIDE history
  2. Extract failed CONTRACTs from TIDE_1
  3. Show how TIDE_2 fixed the issues
  4. Generate learning report
  5. Identify patterns across multiple TIDEs
  6. Create recommendations for future ROUTEs
  7. Store extracted learnings for reuse
  8. Demonstrate knowledge accumulation
```

## Evidence Required

```yaml
evidence_required:
  - "GET /api/tides/learnings/:route_id returns learning analysis"
  - "Failed CONTRACTs from TIDE_1 identified"
  - "Success patterns from TIDE_2 shown"
  - "Learning report generated"
  - "PoC_1 completion evidence documented"
```

## Dependencies

```yaml
depends_on:
  - "CONTRACT_006_TIDE_EXECUTION"   # Need TIDE history
  - "CONTRACT_007_TEST_EXECUTION"   # Need test data with failures
```

## Triggers Next

```yaml
triggers_next:
  - "POC_COMPLETE"  # All evidence collected for PoC_1
```

## Implementation Details

### Input
```yaml
input:
  - "Multiple TIDEs for same ROUTE"
  - "Learnings field populated"
  - "CONTRACT execution history"
```

### Output
```yaml
output:
  - "Learning extraction API"
  - "Pattern analysis report"
  - "Evidence of improvement"
  - "PoC completion documentation"
```

### Tools/Technologies
```yaml
tools:
  - "Data analysis in TypeScript"
  - "JSON report generation"
  - "Pattern matching logic"
```

## Validation

```yaml
validation_steps:
  - step: "Extract learnings from test ROUTE"
    expected: |
      GET /api/tides/learnings/ROUTE_HELLO_WORLD
      Returns:
      {
        "route_id": "ROUTE_HELLO_WORLD",
        "total_tides": 2,
        "time_to_success": "TIDE_2",
        "failures_in_tide_1": [
          {
            "contract_id": "CONTRACT_HELLO_2",
            "issue": "Route typo: /helo",
            "learning": "Always verify route strings"
          }
        ],
        "improvements_in_tide_2": [
          {
            "contract_id": "CONTRACT_HELLO_2",
            "fix": "Corrected route to /hello",
            "result": "completed"
          }
        ],
        "patterns_identified": [
          "Typos are common in first attempts",
          "Reusing successful CONTRACTs saves time"
        ],
        "recommendations": [
          "Add route validation CONTRACT",
          "Create linting rules for endpoints"
        ]
      }
      
  - step: "Generate PoC completion report"
    expected: |
      GET /api/poc/report
      Returns:
      {
        "poc": "PoC_1_EPIC_TIDE_CORE",
        "status": "PROVEN",
        "evidence": {
          "contracts_table": "✅ Created and operational",
          "routes_table": "✅ Created with sequencing",
          "tides_table": "✅ Created with execution tracking",
          "crud_apis": "✅ All endpoints functional",
          "tide_execution": "✅ Multiple TIDEs demonstrated",
          "learning_extraction": "✅ Patterns identified"
        },
        "core_concepts_proven": {
          "CONTRACT": "Atomic units work",
          "ROUTE": "Sequencing achieves goals",
          "TIDE": "Iteration enables learning"
        },
        "next_poc": "PoC_2_SEMANTIC_SEARCH"
      }
```

## Error Handling

```yaml
known_issues:
  - issue: "No TIDEs for ROUTE"
    solution: "Return empty learning report"
    
  - issue: "No failures to learn from"
    solution: "Report perfect execution as learning"
    
  - issue: "Learnings field empty"
    solution: "Analyze execution data instead"
```

## Learning Preservation

```yaml
learnings:
  - "Most ROUTEs need 2-3 TIDEs to prove"
  - "First TIDE usually has 30-50% failure rate"
  - "Common patterns emerge across projects"
  - "Learning extraction enables continuous improvement"
```

## Code Structure

```typescript
// src/core/tides/learning.service.ts
export class LearningService {
  async extractLearnings(routeId: string): Promise<LearningReport> {
    // Get all TIDEs for ROUTE
    const tides = await this.tideRepo.findByRoute(routeId);
    if (tides.length === 0) {
      return { message: "No execution history" };
    }
    
    // Analyze failures in early TIDEs
    const failures = [];
    const tide1 = tides[0];
    for (const [contractId, execution] of Object.entries(tide1.contracts_executed)) {
      if (execution.status === 'failed') {
        failures.push({
          contract_id: contractId,
          issue: execution.evidence || execution.error,
          tide_number: 1
        });
      }
    }
    
    // Find improvements in later TIDEs
    const improvements = [];
    if (tides.length > 1) {
      const lastTide = tides[tides.length - 1];
      for (const failure of failures) {
        const execution = lastTide.contracts_executed[failure.contract_id];
        if (execution?.status === 'completed') {
          improvements.push({
            contract_id: failure.contract_id,
            original_issue: failure.issue,
            fix: execution.evidence,
            tide_resolved: lastTide.tide_number
          });
        }
      }
    }
    
    // Identify patterns
    const patterns = this.identifyPatterns(tides);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(failures, improvements);
    
    return {
      route_id: routeId,
      total_tides: tides.length,
      success_tide: tides.find(t => t.outcome === 'success')?.tide_number,
      failures,
      improvements,
      patterns,
      recommendations,
      overall_learning: this.summarizeLearning(tides)
    };
  }
  
  private identifyPatterns(tides: Tide[]): string[] {
    const patterns = [];
    
    // Check for common failure types
    const failureReasons = tides
      .flatMap(t => Object.values(t.contracts_executed))
      .filter(e => e.status === 'failed')
      .map(e => e.error || e.evidence);
    
    if (failureReasons.some(r => r?.includes('typo'))) {
      patterns.push('Typos are common in initial attempts');
    }
    
    if (failureReasons.some(r => r?.includes('connection'))) {
      patterns.push('Connection issues need retry logic');
    }
    
    // Check for reuse patterns
    const reusedContracts = tides
      .slice(1)
      .flatMap(t => Object.entries(t.contracts_executed))
      .filter(([_, e]) => e.evidence?.includes('reused'))
      .length;
    
    if (reusedContracts > 0) {
      patterns.push(`${reusedContracts} CONTRACTs reused across TIDEs`);
    }
    
    return patterns;
  }
}

// src/api/routes/learning.routes.ts
router.get('/api/tides/learnings/:route_id', learningController.extract);
router.get('/api/poc/report', learningController.pocReport);
```

## Final Evidence Collection

```yaml
evidence_checklist:
  database:
    - "✅ Three tables created (contracts, routes, tides)"
    - "✅ Foreign keys and constraints working"
    - "✅ JSONB fields for flexible data"
    
  apis:
    - "✅ CONTRACT CRUD operational"
    - "✅ ROUTE CRUD with sequencing"
    - "✅ TIDE execution tracking"
    - "✅ Learning extraction endpoint"
    
  core_demonstration:
    - "✅ TIDE_1 with partial failure shown"
    - "✅ TIDE_2 fixing issues demonstrated"
    - "✅ Learning preserved and extracted"
    - "✅ ROUTE marked as proven"
    
  poc_completion:
    - "✅ All 8 CONTRACTs documented"
    - "✅ Test execution successful"
    - "✅ Learning patterns identified"
    - "✅ Evidence of EPIC-TIDE methodology working"
```

---

*CONTRACT Status: pending*
*Note: Completing this CONTRACT proves PoC_1 successful*