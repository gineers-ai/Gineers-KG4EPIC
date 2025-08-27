# CONTRACT: CONTRACT_005_ROUTE_CRUD

## CONTRACT Metadata

```yaml
contract_id: "CONTRACT_005_ROUTE_CRUD"
contract_version: "1.0.0"
contract_type: "implementation"
created_by: "Terminal-1-architect"
created_at: "2025-01-25"
parent_route: "ROUTE_GINEERS_KG_POC1_001"
```

## What To Build

```yaml
what: "CRUD operations for ROUTE entities with CONTRACT sequencing"
```

## How To Build

```yaml
how: |
  1. Create ROUTE model/interface in TypeScript
  2. Implement ROUTE repository with array handling
  3. Create ROUTE service with sequence validation
  4. Build ROUTE controller for HTTP handling
  5. Validate CONTRACT sequence exists
  6. Implement ROUTE-CONTRACT relationship
  7. Add ability to mark ROUTE as proven
  8. Test ROUTE creation with multiple CONTRACTs
```

## Evidence Required

```yaml
evidence_required:
  - "POST /api/routes/create creates ROUTE with CONTRACT sequence"
  - "GET /api/routes/:id returns ROUTE with CONTRACTs"
  - "POST /api/routes/update modifies ROUTE"
  - "CONTRACT sequence validated on creation"
  - "ROUTE proven flag can be set"
```

## Dependencies

```yaml
depends_on:
  - "CONTRACT_002_DATABASE_SCHEMA"  # Need routes table
  - "CONTRACT_003_API_STRUCTURE"    # Need API framework
  - "CONTRACT_004_CONTRACT_CRUD"    # Need to validate CONTRACTs exist
```

## Triggers Next

```yaml
triggers_next:
  - "CONTRACT_006_TIDE_EXECUTION"  # Can execute ROUTEs through TIDEs
```

## Implementation Details

### Input
```yaml
input:
  - "routes table in database"
  - "contracts table for validation"
  - "Express server running"
```

### Output
```yaml
output:
  - "src/core/routes/* files"
  - "Working ROUTE API endpoints"
  - "ROUTE-CONTRACT sequencing"
  - "Validation of CONTRACT dependencies"
```

### Tools/Technologies
```yaml
tools:
  - "PostgreSQL arrays for sequence"
  - "TypeScript interfaces"
  - "Async validation"
```

## Validation

```yaml
validation_steps:
  - step: "Create ROUTE with CONTRACT sequence"
    expected: |
      POST /api/routes/create
      {
        "route_id": "ROUTE_TEST_001",
        "goal": "Test ROUTE execution",
        "contract_sequence": ["TEST_001", "TEST_002", "TEST_003"]
      }
      # Returns: 201 Created with ROUTE data
      
  - step: "Retrieve ROUTE with CONTRACTs"
    expected: |
      GET /api/routes/ROUTE_TEST_001
      # Returns: ROUTE with expanded CONTRACT details
      
  - step: "Mark ROUTE as proven"
    expected: |
      POST /api/routes/update
      {
        "route_id": "ROUTE_TEST_001",
        "proven": true,
        "proven_by_tide": "TIDE_TEST_2"
      }
      # Returns: 200 OK with updated ROUTE
      
  - step: "Validate non-existent CONTRACT in sequence"
    expected: |
      POST /api/routes/create
      {
        "route_id": "ROUTE_BAD",
        "goal": "Invalid ROUTE",
        "contract_sequence": ["DOES_NOT_EXIST"]
      }
      # Returns: 400 Bad Request - CONTRACT not found
```

## Error Handling

```yaml
known_issues:
  - issue: "CONTRACT in sequence doesn't exist"
    solution: "Validate all CONTRACTs before creating ROUTE"
    
  - issue: "Empty CONTRACT sequence"
    solution: "Require at least one CONTRACT"
    
  - issue: "Circular dependencies"
    solution: "Check for cycles in triggers_next"
```

## Learning Preservation

```yaml
learnings:
  - "PostgreSQL TEXT[] perfect for sequence storage"
  - "Validate CONTRACT existence before ROUTE creation"
  - "Expand CONTRACT details on ROUTE retrieval"
  - "Keep sequence order preservation"
```

## Code Structure

```typescript
// src/core/routes/route.model.ts
export interface Route {
  route_id: string;
  goal: string;
  contract_sequence: string[];
  evidence_gates?: any;
  proven: boolean;
  proven_by_tide?: string;
  created_at?: Date;
  updated_at?: Date;
}

// src/core/routes/route.service.ts
export class RouteService {
  async createRoute(route: Route): Promise<Route> {
    // Validate all CONTRACTs exist
    for (const contractId of route.contract_sequence) {
      const exists = await this.contractRepo.findById(contractId);
      if (!exists) {
        throw new Error(`CONTRACT ${contractId} not found`);
      }
    }
    
    // Create ROUTE
    return await this.routeRepo.create(route);
  }
  
  async getRouteWithContracts(id: string): Promise<RouteWithContracts> {
    const route = await this.routeRepo.findById(id);
    if (!route) throw new NotFoundError();
    
    // Expand CONTRACT details
    const contracts = await Promise.all(
      route.contract_sequence.map(id => 
        this.contractRepo.findById(id)
      )
    );
    
    return { ...route, contracts };
  }
}

// src/api/routes/routes.routes.ts
router.post('/api/routes/create', routeController.create);
router.get('/api/routes/:id', routeController.get);
router.post('/api/routes/update', routeController.update);
router.get('/api/routes', routeController.list);
```

---

*CONTRACT Status: pending*