# CONTRACT: CONTRACT_006_TIDE_EXECUTION

## CONTRACT Metadata

```yaml
contract_id: "CONTRACT_006_TIDE_EXECUTION"
contract_version: "1.0.0"
contract_type: "implementation"
created_by: "Terminal-1-architect"
created_at: "2025-01-25"
parent_route: "ROUTE_GINEERS_KG_POC1_001"
```

## What To Build

```yaml
what: "TIDE execution system to track ROUTE attempts with learning preservation"
```

## How To Build

```yaml
how: |
  1. Create TIDE model/interface in TypeScript
  2. Implement TIDE repository with JSONB handling
  3. Create TIDE service for execution tracking
  4. Build APIs to create TIDE for ROUTE
  5. Implement CONTRACT execution recording
  6. Track partial/complete/failed outcomes
  7. Store learnings from failures
  8. Ensure TIDE numbering is sequential
```

## Evidence Required

```yaml
evidence_required:
  - "POST /api/tides/create starts new TIDE for ROUTE"
  - "POST /api/tides/execute records CONTRACT execution"
  - "TIDE tracks success/partial/failed outcomes"
  - "Multiple TIDEs for same ROUTE numbered correctly"
  - "Learnings preserved from failed attempts"
```

## Dependencies

```yaml
depends_on:
  - "CONTRACT_002_DATABASE_SCHEMA"  # Need tides table
  - "CONTRACT_004_CONTRACT_CRUD"    # Need CONTRACT operations
  - "CONTRACT_005_ROUTE_CRUD"       # Need ROUTE to execute
```

## Triggers Next

```yaml
triggers_next:
  - "CONTRACT_007_TEST_EXECUTION"  # Can test TIDE execution
  - "CONTRACT_008_LEARNING_EXTRACTION"  # Can extract learnings
```

## Implementation Details

### Input
```yaml
input:
  - "tides table in database"
  - "Valid ROUTE to execute"
  - "CONTRACTs in sequence"
```

### Output
```yaml
output:
  - "src/core/tides/* files"
  - "TIDE execution tracking"
  - "CONTRACT execution history"
  - "Learning preservation system"
```

### Tools/Technologies
```yaml
tools:
  - "JSONB for flexible execution data"
  - "Transaction support for consistency"
  - "Async execution tracking"
```

## Validation

```yaml
validation_steps:
  - step: "Create first TIDE for ROUTE"
    expected: |
      POST /api/tides/create
      {
        "route_id": "ROUTE_TEST_001"
      }
      # Returns: TIDE with tide_number: 1
      
  - step: "Execute CONTRACT in TIDE"
    expected: |
      POST /api/tides/execute
      {
        "tide_id": "TIDE_TEST_1",
        "contract_id": "TEST_001",
        "status": "completed",
        "evidence": "Test passed"
      }
      # Returns: Updated TIDE with CONTRACT status
      
  - step: "Complete TIDE with partial outcome"
    expected: |
      POST /api/tides/complete
      {
        "tide_id": "TIDE_TEST_1",
        "outcome": "partial",
        "learnings": "CONTRACT TEST_002 failed due to typo"
      }
      # Returns: TIDE with outcome and learnings
      
  - step: "Create second TIDE (automatic numbering)"
    expected: |
      POST /api/tides/create
      {
        "route_id": "ROUTE_TEST_001"
      }
      # Returns: TIDE with tide_number: 2
```

## Error Handling

```yaml
known_issues:
  - issue: "TIDE already exists for number"
    solution: "Auto-increment to next available number"
    
  - issue: "Invalid CONTRACT execution order"
    solution: "Warn but allow (real execution is messy)"
    
  - issue: "ROUTE doesn't exist"
    solution: "Return 404 with clear message"
```

## Learning Preservation

```yaml
learnings:
  - "JSONB perfect for flexible execution data"
  - "Allow any execution order (reality isn't perfect)"
  - "Learnings field critical for improvement"
  - "Keep all TIDEs, even failed ones"
```

## Code Structure

```typescript
// src/core/tides/tide.model.ts
export interface Tide {
  tide_id: string;
  route_id: string;
  tide_number: number;
  contracts_executed: ContractExecution;
  evidence_collected?: any;
  outcome?: 'success' | 'partial' | 'failed';
  learnings?: string;
  created_at?: Date;
}

export interface ContractExecution {
  [contract_id: string]: {
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    evidence?: any;
    error?: string;
    executed_at?: Date;
  };
}

// src/core/tides/tide.service.ts
export class TideService {
  async createTide(routeId: string): Promise<Tide> {
    // Get ROUTE
    const route = await this.routeRepo.findById(routeId);
    if (!route) throw new NotFoundError();
    
    // Get next TIDE number
    const lastTide = await this.tideRepo.getLastTide(routeId);
    const tideNumber = lastTide ? lastTide.tide_number + 1 : 1;
    
    // Initialize CONTRACT execution tracking
    const contractsExecuted = {};
    route.contract_sequence.forEach(contractId => {
      contractsExecuted[contractId] = { status: 'pending' };
    });
    
    // Create TIDE
    return await this.tideRepo.create({
      tide_id: `TIDE_${routeId}_${tideNumber}`,
      route_id: routeId,
      tide_number: tideNumber,
      contracts_executed: contractsExecuted
    });
  }
  
  async executeContract(
    tideId: string, 
    contractId: string, 
    status: string, 
    evidence?: any
  ): Promise<Tide> {
    const tide = await this.tideRepo.findById(tideId);
    if (!tide) throw new NotFoundError();
    
    // Update CONTRACT execution
    tide.contracts_executed[contractId] = {
      status,
      evidence,
      executed_at: new Date()
    };
    
    // Check overall TIDE status
    const statuses = Object.values(tide.contracts_executed)
      .map(c => c.status);
    
    if (statuses.every(s => s === 'completed')) {
      tide.outcome = 'success';
    } else if (statuses.some(s => s === 'failed')) {
      tide.outcome = 'partial';
    }
    
    return await this.tideRepo.update(tide);
  }
}
```

---

*CONTRACT Status: pending*