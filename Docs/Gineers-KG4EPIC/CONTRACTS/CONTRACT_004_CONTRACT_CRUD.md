# CONTRACT: CONTRACT_004_CONTRACT_CRUD

## CONTRACT Metadata

```yaml
contract_id: "CONTRACT_004_CONTRACT_CRUD"
contract_version: "1.0.0"
contract_type: "implementation"
created_by: "Terminal-1-architect"
created_at: "2025-01-25"
parent_route: "ROUTE_GINEERS_KG_POC1_001"
```

## What To Build

```yaml
what: "CRUD operations for CONTRACT entities via REST API"
```

## How To Build

```yaml
how: |
  1. Create CONTRACT model/interface in TypeScript
  2. Implement CONTRACT repository for database operations
  3. Create CONTRACT service with business logic
  4. Build CONTRACT controller for HTTP handling
  5. Define API routes (GET for read, POST for all mutations)
  6. Add input validation
  7. Implement error handling
  8. Test all CRUD operations
```

## Evidence Required

```yaml
evidence_required:
  - "POST /api/contracts/create creates new CONTRACT"
  - "GET /api/contracts/:id retrieves CONTRACT"
  - "POST /api/contracts/update updates CONTRACT"
  - "POST /api/contracts/delete soft deletes CONTRACT"
  - "GET /api/contracts lists all CONTRACTs"
```

## Dependencies

```yaml
depends_on:
  - "CONTRACT_002_DATABASE_SCHEMA"  # Need contracts table
  - "CONTRACT_003_API_STRUCTURE"    # Need API framework
```

## Triggers Next

```yaml
triggers_next:
  - "CONTRACT_005_ROUTE_CRUD"      # Similar pattern for ROUTEs
  - "CONTRACT_006_TIDE_EXECUTION"  # Can track CONTRACT execution
```

## Implementation Details

### Input
```yaml
input:
  - "contracts table in database"
  - "Express server running"
  - "Database connection established"
```

### Output
```yaml
output:
  - "src/core/contracts/* files"
  - "Working CONTRACT API endpoints"
  - "CONTRACT TypeScript interfaces"
  - "Validation schemas"
```

### Tools/Technologies
```yaml
tools:
  - "TypeScript interfaces"
  - "node-postgres for DB access"
  - "Joi or Zod for validation"
  - "Express Router"
```

## Validation

```yaml
validation_steps:
  - step: "Create CONTRACT via API"
    expected: |
      POST /api/contracts/create
      {
        "contract_id": "TEST_001",
        "what": "Test CONTRACT",
        "how": "Test implementation",
        "evidence_required": "Test passes"
      }
      # Returns: 201 Created with CONTRACT data
      
  - step: "Retrieve CONTRACT"
    expected: |
      GET /api/contracts/TEST_001
      # Returns: CONTRACT object with all fields
      
  - step: "Update CONTRACT"
    expected: |
      POST /api/contracts/update
      {
        "contract_id": "TEST_001",
        "evidence_collected": {"test": "passed"}
      }
      # Returns: 200 OK with updated CONTRACT
      
  - step: "List all CONTRACTs"
    expected: |
      GET /api/contracts
      # Returns: Array of CONTRACT objects
```

## Error Handling

```yaml
known_issues:
  - issue: "Duplicate contract_id"
    solution: "Return 409 Conflict with clear message"
    
  - issue: "CONTRACT not found"
    solution: "Return 404 with contract_id in message"
    
  - issue: "Invalid input format"
    solution: "Return 400 with validation errors"
```

## Learning Preservation

```yaml
learnings:
  - "Use repository pattern for database abstraction"
  - "Validate at controller level, not database"
  - "Return created object after POST/create"
  - "Soft delete preserves history"
```

## Code Structure

```typescript
// src/core/contracts/contract.model.ts
export interface Contract {
  contract_id: string;
  what: string;
  how: string;
  evidence_required: string;
  triggers_next?: string;
  evidence_collected?: any;
  created_at?: Date;
  updated_at?: Date;
}

// src/core/contracts/contract.repository.ts
export class ContractRepository {
  async create(contract: Contract): Promise<Contract> {
    // INSERT INTO contracts...
  }
  
  async findById(id: string): Promise<Contract | null> {
    // SELECT * FROM contracts WHERE contract_id = $1
  }
  
  async update(id: string, data: Partial<Contract>): Promise<Contract> {
    // UPDATE contracts SET ... WHERE contract_id = $1
  }
  
  async softDelete(id: string): Promise<void> {
    // UPDATE contracts SET deleted_at = NOW() WHERE contract_id = $1
  }
  
  async findAll(): Promise<Contract[]> {
    // SELECT * FROM contracts WHERE deleted_at IS NULL
  }
}

// src/core/contracts/contract.controller.ts
export class ContractController {
  async create(req: Request, res: Response) {
    // Validate input
    // Call service
    // Return 201 with created CONTRACT
  }
  
  async get(req: Request, res: Response) {
    // Get ID from params
    // Call service
    // Return CONTRACT or 404
  }
}
```

---

*CONTRACT Status: pending*