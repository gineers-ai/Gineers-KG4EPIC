# EPIC-TIDE API Contract Specification
# RESTful API endpoints that MCP tools call

## Base Configuration
```yaml
base_url: https://api.epic-tide.com/v1
auth: Bearer {API_KEY}
content_type: application/json
```

## API Endpoints

### 1. WORK Endpoints

#### POST /works
Create a new WORK
```http
POST /works
Content-Type: application/json

Request:
{
  "what": "Setup database",
  "how": ["Create schema", "Run migrations"],
  "metrics": ["Database accessible"]
}

Response (201):
{
  "work_id": "work_2024_01_15_a7f3",
  "what": "Setup database",
  "how": ["Create schema", "Run migrations"],
  "metrics": ["Database accessible"],
  "created_at": "2024-01-15T10:30:00Z",
  "version": 1
}

Errors:
400: Invalid input format
409: Duplicate work name
```

#### GET /works/{work_name}
Retrieve WORK by name
```http
GET /works/setup-database

Response (200):
{
  "work_id": "work_2024_01_15_a7f3",
  "name": "setup-database",
  "what": "Setup database",
  "how": ["Create schema", "Run migrations"],
  "metrics": ["Database accessible"],
  "created_at": "2024-01-15T10:30:00Z",
  "usage_count": 5,
  "success_rate": 0.8
}

Errors:
404: Work not found
```

### 2. PATH Endpoints

#### POST /paths
Create a new PATH blueprint
```http
POST /paths
Content-Type: application/json

Request:
{
  "what": "Build user API",
  "works": ["setup-env", "setup-database", "create-api"],
  "metrics": ["API running", "Tests pass"]
}

Response (201):
{
  "path_id": "path_2024_01_15_b8c4",
  "what": "Build user API",
  "works": ["setup-env", "setup-database", "create-api"],
  "metrics": ["API running", "Tests pass"],
  "created_at": "2024-01-15T10:30:00Z",
  "proven": false
}

Errors:
400: Invalid work reference
404: Referenced work not found
```

#### GET /paths/{path_name}
Get PATH details with execution history
```http
GET /paths/user-api

Response (200):
{
  "path_id": "path_2024_01_15_b8c4",
  "name": "user-api",
  "what": "Build user API",
  "works": ["setup-env", "setup-database", "create-api"],
  "metrics": ["API running", "Tests pass"],
  "proven": false,
  "tide_count": 2,
  "last_tide": {
    "attempt": 2,
    "outcome": "success",
    "completed_at": "2024-01-15T12:00:00Z"
  }
}
```

### 3. TIDE Endpoints

#### POST /tides
Start a new TIDE execution
```http
POST /tides
Content-Type: application/json

Request:
{
  "path_name": "user-api",
  "adaptations": [
    {
      "action": "insert",
      "target": "add-auth",
      "details": {
        "position": "before",
        "relative_to": "create-api"
      }
    }
  ]
}

Response (201):
{
  "tide_id": "tide_2024_01_15_c9d5",
  "path_id": "path_2024_01_15_b8c4",
  "attempt": 3,
  "status": "running",
  "started_at": "2024-01-15T14:00:00Z"
}

Errors:
404: PATH not found
409: TIDE already running for this PATH
```

#### PATCH /tides/{tide_id}/execution
Update work execution status
```http
PATCH /tides/tide_2024_01_15_c9d5/execution
Content-Type: application/json

Request:
{
  "work_name": "setup-env",
  "status": "complete",
  "output": "Environment ready at localhost:3000"
}

Response (200):
{
  "success": true,
  "work_name": "setup-env",
  "status": "complete",
  "duration": "2m15s",
  "updated_at": "2024-01-15T14:02:15Z"
}

Errors:
404: TIDE not found
400: Invalid status value
409: TIDE already completed
```

#### POST /tides/{tide_id}/complete
Complete a TIDE with outcome
```http
POST /tides/tide_2024_01_15_c9d5/complete
Content-Type: application/json

Request:
{
  "outcome": "success",
  "metrics_achieved": {
    "API running": true,
    "Tests pass": true
  },
  "learnings": "Auth middleware must be initialized before API endpoints"
}

Response (200):
{
  "tide_id": "tide_2024_01_15_c9d5",
  "outcome": "success",
  "completed_at": "2024-01-15T14:30:00Z",
  "duration": "30m",
  "next_action": "create_pattern",
  "pattern_candidate": true
}

Errors:
404: TIDE not found
400: Invalid outcome value
409: TIDE already completed
```

### 4. PATTERN Endpoints

#### GET /patterns
Query patterns by criteria
```http
GET /patterns?domain=rest-api&min_success_rate=0.8

Response (200):
{
  "patterns": [
    {
      "pattern_id": "pattern_rest_api_v2",
      "domain": "rest-api",
      "common_sequence": ["setup-env", "create-db", "add-auth", "create-api"],
      "success_rate": 0.85,
      "usage_count": 42,
      "proven_adaptations": {
        "auth_before_api": {
          "success_rate": 0.9,
          "description": "Always add auth before API"
        }
      }
    }
  ],
  "total": 1
}
```

#### POST /patterns
Create pattern from successful TIDEs
```http
POST /patterns
Content-Type: application/json

Request:
{
  "tide_ids": ["tide_1", "tide_2", "tide_3"],
  "domain": "rest-api",
  "tags": ["nodejs", "postgres"]
}

Response (201):
{
  "pattern_id": "pattern_2024_01_15_d0e6",
  "domain": "rest-api",
  "distilled_from": ["tide_1", "tide_2", "tide_3"],
  "common_sequence": ["setup-env", "create-db", "add-auth", "create-api"],
  "success_rate": 0.85,
  "created_at": "2024-01-15T15:00:00Z"
}

Errors:
400: Insufficient TIDEs for pattern
404: TIDE not found
```

### 5. Analytics Endpoints

#### GET /analytics/success-rates
Get success rates by domain
```http
GET /analytics/success-rates

Response (200):
{
  "domains": {
    "rest-api": {
      "with_pattern": 0.85,
      "without_pattern": 0.35,
      "improvement": "142%"
    },
    "game": {
      "with_pattern": 0.78,
      "without_pattern": 0.25,
      "improvement": "212%"
    }
  }
}
```

#### GET /analytics/common-failures
Get most common failure points
```http
GET /analytics/common-failures

Response (200):
{
  "failures": [
    {
      "work": "create-api",
      "error": "Missing authentication",
      "frequency": 0.7,
      "solution": "Add auth middleware before API"
    },
    {
      "work": "setup-database",
      "error": "Connection pool exhausted",
      "frequency": 0.3,
      "solution": "Increase pool size to 20+"
    }
  ]
}
```

## Error Response Format
```json
{
  "error": {
    "code": "INVALID_STATUS",
    "message": "Status must be one of: complete, failed, blocked, reused",
    "field": "status",
    "provided_value": "finished"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Rate Limiting
```http
Headers:
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642248000
```

## Webhook Events

The server can emit webhooks for:
```yaml
events:
  - tide.started
  - tide.completed
  - work.executed
  - pattern.created
  - path.proven

payload:
{
  "event": "tide.completed",
  "data": {
    "tide_id": "...",
    "outcome": "success",
    "path_id": "..."
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Data Consistency Rules

1. **Work References**: Must exist before PATH creation
2. **Attempt Numbers**: Sequential per PATH
3. **TIDE Status**: Only one active TIDE per PATH
4. **Completion**: TIDE must have all works executed before completion
5. **Pattern Creation**: Requires minimum 3 successful TIDEs

## Migration Support

For future versions:
```http
Headers:
API-Version: 1.0
Accept: application/vnd.epic-tide.v1+json
```