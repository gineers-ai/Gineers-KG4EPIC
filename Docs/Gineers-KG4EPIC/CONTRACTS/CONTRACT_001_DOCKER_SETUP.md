# CONTRACT: CONTRACT_001_DOCKER_SETUP

## CONTRACT Metadata

```yaml
contract_id: "CONTRACT_001_DOCKER_SETUP"
contract_version: "1.0.0"
contract_type: "setup"
created_by: "Terminal-1-architect"
created_at: "2025-01-25"
parent_route: "ROUTE_GINEERS_KG_POC1_001"
```

## What To Build

```yaml
what: "Docker environment for Gineers-KG4EPIC with PostgreSQL and API server"
```

## How To Build

```yaml
how: |
  1. Create docker/ directory structure
  2. Write Dockerfile for API server (Node.js + TypeScript)
  3. Write Dockerfile for PostgreSQL with pgvector
  4. Create docker-compose.yml for orchestration
  5. Configure networking between services
  6. Set up volume mounts for data persistence
  7. Add health checks for both services
```

## Evidence Required

```yaml
evidence_required:
  - "docker-compose up starts both services"
  - "PostgreSQL accessible on port 5437"
  - "API server responds on port 3001"
  - "Services can communicate internally"
  - "Data persists after container restart"
```

## Dependencies

```yaml
depends_on: []  # First CONTRACT, no dependencies
```

## Triggers Next

```yaml
triggers_next:
  - "CONTRACT_002_DATABASE_SCHEMA"
  - "CONTRACT_003_API_STRUCTURE"
```

## Implementation Details

### Input
```yaml
input:
  - "Docker installed on host machine"
  - "Port 3001 and 5437 available"
  - "Base Node.js and PostgreSQL images"
```

### Output
```yaml
output:
  - "docker/Dockerfile.api"
  - "docker/Dockerfile.db"
  - "docker-compose.yml"
  - "Running containers: gineers-kg4epic-api, gineers-kg4epic-db"
```

### Tools/Technologies
```yaml
tools:
  - "Docker 24+"
  - "Docker Compose v2"
  - "Node.js 18 Alpine image"
  - "PostgreSQL 15 with pgvector"
```

## Validation

```yaml
validation_steps:
  - step: "Run docker-compose up"
    expected: "Both containers start without errors"
    
  - step: "Check postgres: docker exec gineers-kg4epic-db psql -U postgres -c 'SELECT 1'"
    expected: "Returns 1"
    
  - step: "Check API: curl http://localhost:3001/health"
    expected: "Returns {status: 'healthy'}"
    
  - step: "Stop and restart: docker-compose down && docker-compose up"
    expected: "Services restart with data intact"
```

## Error Handling

```yaml
known_issues:
  - issue: "Port 5437 already in use"
    solution: "Change mapping to another port (e.g., 5438:5432) in docker-compose.yml"
    
  - issue: "pgvector extension not available"
    solution: "Use ankane/pgvector image or install extension manually"
    
  - issue: "Node modules not found in container"
    solution: "Ensure COPY package*.json happens before npm install"
```

## Learning Preservation

```yaml
learnings:
  - "Always use specific image tags, not 'latest'"
  - "Health checks prevent dependent services from starting too early"
  - "Named volumes better than bind mounts for database data"
  - "Multi-stage builds reduce final image size"
```

---

*CONTRACT Status: pending*