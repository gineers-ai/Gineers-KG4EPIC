# Gineers-KG4EPIC Project Structure

> **Note**: This document contains implementation details that belong in CONTRACTs.
> For the high-level project roadmap, see PROJECT_ROUTE.md
> This structure will be created by CONTRACT_003_API_STRUCTURE

## Core Principles
- **Passive Knowledge Server**: Read-heavy, write-light
- **Security First**: All mutations through POST only
- **Docker Native**: Everything containerized
- **Modular Architecture**: Clear separation of concerns

## Project Folder Structure (Implementation Detail)

```
Gineers-KG4EPIC/
├── docker/
│   ├── Dockerfile.api          # API server image
│   ├── Dockerfile.db           # PostgreSQL with pgvector
│   └── docker-compose.yml      # Orchestration
│
├── src/
│   ├── core/                   # Core EPIC-TIDE implementation
│   │   ├── contracts/          # CONTRACT domain logic
│   │   │   ├── contract.model.ts
│   │   │   ├── contract.service.ts
│   │   │   └── contract.controller.ts
│   │   ├── routes/             # ROUTE domain logic
│   │   │   ├── route.model.ts
│   │   │   ├── route.service.ts
│   │   │   └── route.controller.ts
│   │   └── tides/              # TIDE execution tracking
│   │       ├── tide.model.ts
│   │       ├── tide.service.ts
│   │       └── tide.controller.ts
│   │
│   ├── api/                    # REST API layer
│   │   ├── server.ts           # Express server setup
│   │   ├── middleware/         # Auth, validation, etc.
│   │   │   ├── security.ts    # POST-only enforcement
│   │   │   └── validation.ts
│   │   └── routes/             # API route definitions
│   │       ├── index.ts
│   │       ├── contracts.routes.ts
│   │       ├── routes.routes.ts
│   │       └── tides.routes.ts
│   │
│   ├── database/               # Database layer
│   │   ├── connection.ts       # PostgreSQL connection
│   │   ├── migrations/         # Schema migrations
│   │   │   ├── 001_create_contracts.sql
│   │   │   ├── 002_create_routes.sql
│   │   │   └── 003_create_tides.sql
│   │   └── repositories/       # Data access layer
│   │       ├── contract.repository.ts
│   │       ├── route.repository.ts
│   │       └── tide.repository.ts
│   │
│   ├── shared/                 # Shared utilities
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Helper functions
│   │   └── constants/         # App constants
│   │
│   └── config/                # Configuration
│       ├── database.config.ts
│       ├── server.config.ts
│       └── environment.ts
│
├── tests/                      # Test files
│   ├── unit/                  # Unit tests
│   ├── integration/           # Integration tests
│   └── e2e/                   # End-to-end tests
│
├── scripts/                    # Utility scripts
│   ├── init-db.sh            # Database initialization
│   ├── seed-data.ts          # Seed test data
│   └── validate-schema.ts    # Schema validation
│
├── docs/                       # Documentation (separate from Docs/)
│   ├── api/                   # API documentation
│   └── architecture/          # Architecture docs
│
├── Docs/                       # EPIC-TIDE methodology docs
│   └── Gineers-KG4EPIC/      # Project-specific docs
│       ├── CONTRACTS/         # All CONTRACTs
│       ├── ROUTES/           # All ROUTEs
│       ├── TIDES/            # TIDE execution history
│       └── TEMPLATES/        # Document templates
│
├── .env.example               # Environment variables template
├── .dockerignore             # Docker ignore rules
├── .gitignore                # Git ignore rules
├── package.json              # Node.js dependencies
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project overview
```

## Module Architecture

```yaml
layers:
  1_controllers:
    responsibility: "HTTP request/response handling"
    location: "src/core/*/controller.ts"
    
  2_services:
    responsibility: "Business logic"
    location: "src/core/*/service.ts"
    
  3_repositories:
    responsibility: "Data access"
    location: "src/database/repositories/*"
    
  4_models:
    responsibility: "Data structures"
    location: "src/core/*/model.ts"
```

## API Structure (POST-only for mutations)

```yaml
endpoints:
  # Queries (GET allowed)
  GET /api/contracts/:id
  GET /api/routes/:id
  GET /api/tides/:route_id
  
  # All mutations through POST
  POST /api/contracts/create
  POST /api/contracts/update
  POST /api/contracts/delete
  
  POST /api/routes/create
  POST /api/routes/update
  POST /api/routes/delete
  
  POST /api/tides/create
  POST /api/tides/execute
  POST /api/tides/complete
```

## Docker Services

```yaml
services:
  postgres:
    image: "postgres:15-pgvector"
    ports: ["5432:5432"]
    volumes: ["./data/postgres:/var/lib/postgresql/data"]
    
  api:
    build: "./docker/Dockerfile.api"
    ports: ["3000:3000"]
    depends_on: ["postgres"]
    environment:
      - DATABASE_URL
      - NODE_ENV
```

## Security Considerations

```yaml
security:
  api_design:
    - "All mutations through POST only"
    - "No DELETE endpoints (soft delete via POST)"
    - "No direct SQL execution"
    
  validation:
    - "Input sanitization on all endpoints"
    - "Schema validation with Joi/Zod"
    - "Rate limiting on POST endpoints"
    
  database:
    - "Prepared statements only"
    - "Connection pooling"
    - "Read replicas for queries (future)"
```

## Development Workflow

```bash
# Initial setup
npm install
docker-compose up -d postgres
npm run migrate
npm run seed

# Development
npm run dev

# Testing
npm run test:unit
npm run test:integration
npm run test:e2e

# Production
docker-compose up --build
```

---

*This structure supports modular development while maintaining EPIC-TIDE methodology*