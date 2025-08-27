# CONTRACT: CONTRACT_007_TEST_EXECUTION

## CONTRACT Metadata

```yaml
contract_id: "CONTRACT_007_TEST_EXECUTION"
contract_version: "1.0.0"
contract_type: "validation"
created_by: "Terminal-1-architect"
created_at: "2025-01-25"
parent_route: "ROUTE_GINEERS_KG_POC1_001"
```

## What To Build

```yaml
what: "Complete test execution demonstrating TIDE iteration with learning"
```

## How To Build

```yaml
how: |
  1. Create test ROUTE "Build Hello World API"
  2. Add 3 test CONTRACTs (setup, implement, test)
  3. Execute TIDE_1 with deliberate failure
  4. Record partial completion and learning
  5. Execute TIDE_2 fixing the issue
  6. Achieve full success in TIDE_2
  7. Demonstrate learning preservation
  8. Verify ROUTE marked as proven
```

## Evidence Required

```yaml
evidence_required:
  - "Test ROUTE created with 3 CONTRACTs"
  - "TIDE_1 shows partial completion"
  - "Learning captured from TIDE_1 failure"
  - "TIDE_2 fixes issue and completes"
  - "ROUTE marked as proven after TIDE_2"
```

## Dependencies

```yaml
depends_on:
  - "CONTRACT_004_CONTRACT_CRUD"    # Need to create CONTRACTs
  - "CONTRACT_005_ROUTE_CRUD"       # Need to create ROUTE
  - "CONTRACT_006_TIDE_EXECUTION"   # Need TIDE execution
```

## Triggers Next

```yaml
triggers_next:
  - "CONTRACT_008_LEARNING_EXTRACTION"  # Extract learnings from TIDEs
```

## Implementation Details

### Input
```yaml
input:
  - "All APIs functional"
  - "Database with tables"
  - "TIDE execution system"
```

### Output
```yaml
output:
  - "Test ROUTE proven"
  - "2 TIDEs with history"
  - "Learning documentation"
  - "Evidence of iteration"
```

### Tools/Technologies
```yaml
tools:
  - "API testing with curl/Postman"
  - "Database queries for verification"
  - "JSON for execution data"
```

## Validation

```yaml
validation_steps:
  - step: "Create test CONTRACTs"
    expected: |
      CONTRACT_HELLO_1: "Setup Express server"
      CONTRACT_HELLO_2: "Create /hello endpoint"
      CONTRACT_HELLO_3: "Test endpoint response"
      
  - step: "Create test ROUTE"
    expected: |
      ROUTE_HELLO_WORLD:
        goal: "Working Hello World API"
        contract_sequence: [
          "CONTRACT_HELLO_1",
          "CONTRACT_HELLO_2",
          "CONTRACT_HELLO_3"
        ]
      
  - step: "Execute TIDE_1 with failure"
    expected: |
      CONTRACT_HELLO_1: ✅ completed
      CONTRACT_HELLO_2: ❌ failed (route typo: /helo)
      CONTRACT_HELLO_3: ⏸️ blocked
      outcome: partial
      learnings: "Route was '/helo' not '/hello'"
      
  - step: "Execute TIDE_2 with fix"
    expected: |
      CONTRACT_HELLO_1: ✅ reused (skip execution)
      CONTRACT_HELLO_2: ✅ completed (fixed: /hello)
      CONTRACT_HELLO_3: ✅ completed
      outcome: success
      ROUTE: proven = true
```

## Error Handling

```yaml
known_issues:
  - issue: "Can't simulate failure"
    solution: "Manually set CONTRACT status to failed"
    
  - issue: "TIDE numbering wrong"
    solution: "Check unique constraint on (route_id, tide_number)"
    
  - issue: "Learning not preserved"
    solution: "Ensure learnings field saved to database"
```

## Learning Preservation

```yaml
learnings:
  - "Real execution is messy - that's why TIDE exists"
  - "Partial success is common in TIDE_1"
  - "Reusing successful CONTRACTs saves time"
  - "Learning field crucial for improvement"
```

## Test Script

```bash
#!/bin/bash
# test_execution.sh

echo "=== EPIC-TIDE Test Execution ==="

# 1. Create test CONTRACTs
echo "Creating test CONTRACTs..."
curl -X POST http://localhost:3000/api/contracts/create -d '{
  "contract_id": "CONTRACT_HELLO_1",
  "what": "Setup Express server",
  "how": "npm init && npm install express",
  "evidence_required": "Server starts on port 3000"
}'

curl -X POST http://localhost:3000/api/contracts/create -d '{
  "contract_id": "CONTRACT_HELLO_2",
  "what": "Create /hello endpoint",
  "how": "app.get('/hello', (req, res) => res.send('Hello World'))",
  "evidence_required": "Endpoint returns Hello World"
}'

curl -X POST http://localhost:3000/api/contracts/create -d '{
  "contract_id": "CONTRACT_HELLO_3",
  "what": "Test endpoint",
  "how": "curl http://localhost:3000/hello",
  "evidence_required": "200 OK with Hello World"
}'

# 2. Create test ROUTE
echo "Creating test ROUTE..."
curl -X POST http://localhost:3000/api/routes/create -d '{
  "route_id": "ROUTE_HELLO_WORLD",
  "goal": "Working Hello World API",
  "contract_sequence": ["CONTRACT_HELLO_1", "CONTRACT_HELLO_2", "CONTRACT_HELLO_3"]
}'

# 3. Execute TIDE_1 with failure
echo "Executing TIDE_1 (with failure)..."
TIDE_1=$(curl -X POST http://localhost:3000/api/tides/create -d '{
  "route_id": "ROUTE_HELLO_WORLD"
}')

# Execute CONTRACTs
curl -X POST http://localhost:3000/api/tides/execute -d '{
  "tide_id": "TIDE_ROUTE_HELLO_WORLD_1",
  "contract_id": "CONTRACT_HELLO_1",
  "status": "completed",
  "evidence": "Server running"
}'

curl -X POST http://localhost:3000/api/tides/execute -d '{
  "tide_id": "TIDE_ROUTE_HELLO_WORLD_1",
  "contract_id": "CONTRACT_HELLO_2",
  "status": "failed",
  "evidence": "Route typo: /helo instead of /hello"
}'

curl -X POST http://localhost:3000/api/tides/complete -d '{
  "tide_id": "TIDE_ROUTE_HELLO_WORLD_1",
  "outcome": "partial",
  "learnings": "Route was /helo not /hello - need to fix typo"
}'

# 4. Execute TIDE_2 with fix
echo "Executing TIDE_2 (with fix)..."
TIDE_2=$(curl -X POST http://localhost:3000/api/tides/create -d '{
  "route_id": "ROUTE_HELLO_WORLD"
}')

# Skip CONTRACT_HELLO_1 (reuse from TIDE_1)
curl -X POST http://localhost:3000/api/tides/execute -d '{
  "tide_id": "TIDE_ROUTE_HELLO_WORLD_2",
  "contract_id": "CONTRACT_HELLO_1",
  "status": "completed",
  "evidence": "Reused from TIDE_1"
}'

curl -X POST http://localhost:3000/api/tides/execute -d '{
  "tide_id": "TIDE_ROUTE_HELLO_WORLD_2",
  "contract_id": "CONTRACT_HELLO_2",
  "status": "completed",
  "evidence": "Fixed route to /hello"
}'

curl -X POST http://localhost:3000/api/tides/execute -d '{
  "tide_id": "TIDE_ROUTE_HELLO_WORLD_2",
  "contract_id": "CONTRACT_HELLO_3",
  "status": "completed",
  "evidence": "200 OK - Hello World returned"
}'

curl -X POST http://localhost:3000/api/tides/complete -d '{
  "tide_id": "TIDE_ROUTE_HELLO_WORLD_2",
  "outcome": "success"
}'

# 5. Mark ROUTE as proven
curl -X POST http://localhost:3000/api/routes/update -d '{
  "route_id": "ROUTE_HELLO_WORLD",
  "proven": true,
  "proven_by_tide": "TIDE_ROUTE_HELLO_WORLD_2"
}'

echo "=== Test Execution Complete ==="
echo "TIDE_1: Partial (learned about typo)"
echo "TIDE_2: Success (fixed and proven)"
```

---

*CONTRACT Status: pending*