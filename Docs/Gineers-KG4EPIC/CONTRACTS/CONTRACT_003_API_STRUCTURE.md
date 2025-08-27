# CONTRACT: CONTRACT_003_API_STRUCTURE

## CONTRACT Metadata

```yaml
contract_id: "CONTRACT_003_API_STRUCTURE"
contract_version: "1.0.0"
contract_type: "implementation"
created_by: "Terminal-1-architect"
created_at: "2025-01-25"
parent_route: "ROUTE_GINEERS_KG_POC1_001"
```

## What To Build

```yaml
what: "Modular TypeScript/Express API structure with POST-only mutations"
```

## How To Build

```yaml
how: |
  1. Initialize Node.js project with TypeScript
  2. Create src/ directory structure (core, api, database, shared)
  3. Set up Express server with security middleware
  4. Implement POST-only mutation pattern
  5. Create health check endpoint
  6. Set up environment configuration
  7. Create base controller/service/repository classes
  8. Add error handling middleware
```

## Evidence Required

```yaml
evidence_required:
  - "npm start launches server on port 3000"
  - "GET /health returns {status: 'healthy'}"
  - "TypeScript compilation successful"
  - "Modular folder structure created"
  - "POST-only security middleware working"
```

## Dependencies

```yaml
depends_on:
  - "CONTRACT_001_DOCKER_SETUP"  # Need Docker environment
```

## Triggers Next

```yaml
triggers_next:
  - "CONTRACT_004_CONTRACT_CRUD"  # Can implement CONTRACT APIs
  - "CONTRACT_005_ROUTE_CRUD"     # Can implement ROUTE APIs
```

## Implementation Details

### Input
```yaml
input:
  - "Docker container ready"
  - "Node.js 18+ available"
  - "TypeScript 5+ available"
```

### Output
```yaml
output:
  - "src/ folder structure"
  - "package.json with dependencies"
  - "tsconfig.json configuration"
  - "Base classes for MVC pattern"
  - "Running Express server"
```

### Tools/Technologies
```yaml
tools:
  - "Node.js 18"
  - "TypeScript 5"
  - "Express.js"
  - "ts-node-dev for development"
```

## Validation

```yaml
validation_steps:
  - step: "Check folder structure"
    expected: |
      src/
      ├── core/
      │   ├── contracts/
      │   ├── routes/
      │   └── tides/
      ├── api/
      │   ├── server.ts
      │   └── middleware/
      └── database/
      
  - step: "Test health endpoint"
    expected: |
      curl http://localhost:3000/health
      # Returns: {"status": "healthy"}
      
  - step: "Test POST-only security"
    expected: |
      curl -X DELETE http://localhost:3000/api/contracts/123
      # Returns: 405 Method Not Allowed
      
      curl -X POST http://localhost:3000/api/contracts/delete
      # Returns: 200 OK (soft delete through POST)
```

## Error Handling

```yaml
known_issues:
  - issue: "Port 3000 already in use"
    solution: "Use PORT env variable or kill existing process"
    
  - issue: "TypeScript compilation errors"
    solution: "Check tsconfig.json strict mode settings"
    
  - issue: "Module not found errors"
    solution: "Ensure paths in tsconfig.json are correct"
```

## Learning Preservation

```yaml
learnings:
  - "Use barrel exports (index.ts) for clean imports"
  - "Separate concerns: controller → service → repository"
  - "POST-only mutations improve security"
  - "Environment variables for all configuration"
```

## File Structure to Create

```typescript
// src/api/server.ts
import express from 'express';
import { securityMiddleware } from './middleware/security';
import { healthRouter } from './routes/health';

const app = express();

app.use(express.json());
app.use(securityMiddleware);
app.use('/health', healthRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gineers-KG4EPIC API running on port ${PORT}`);
});

// src/api/middleware/security.ts
export const securityMiddleware = (req, res, next) => {
  // Enforce POST-only for mutations
  if (req.path.includes('/api/') && 
      !req.path.includes('/search') &&
      req.method !== 'GET' && 
      req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  next();
};
```

---

*CONTRACT Status: pending*