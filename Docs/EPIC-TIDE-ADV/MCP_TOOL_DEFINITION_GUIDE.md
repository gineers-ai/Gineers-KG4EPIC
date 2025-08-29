# MCP Tool Definition Guide for EPIC-TIDE
# Specification for Model Context Protocol tools

## Overview
This guide defines the MCP tools that bridge Claude Code to the EPIC-TIDE server.

## Tool Definitions

### 1. save-work Tool
```typescript
{
  name: "epic-tide-save-work",
  description: "Save a WORK definition to EPIC-TIDE knowledge system",
  inputSchema: {
    type: "object",
    required: ["what", "how", "metrics"],
    properties: {
      what: {
        type: "string",
        description: "Goal of this work",
        maxLength: 200
      },
      how: {
        type: "array",
        items: { type: "string" },
        minItems: 1,
        maxItems: 20,
        description: "Steps to execute"
      },
      metrics: {
        type: "array", 
        items: { type: "string" },
        minItems: 1,
        maxItems: 10,
        description: "Success criteria"
      }
    }
  },
  // Server adds: id, created_at, version
  returns: {
    type: "object",
    properties: {
      work_id: { type: "string" },
      message: { type: "string" }
    }
  }
}
```

### 2. create-path Tool
```typescript
{
  name: "epic-tide-create-path",
  description: "Create a PATH blueprint in EPIC-TIDE",
  inputSchema: {
    type: "object",
    required: ["what", "works", "metrics"],
    properties: {
      what: {
        type: "string",
        description: "Project goal"
      },
      works: {
        type: "array",
        items: { 
          type: "string",
          pattern: "^[a-z][a-z0-9-]*$"
        },
        minItems: 1,
        description: "Sequence of work names (not IDs)"
      },
      metrics: {
        type: "array",
        items: { type: "string" },
        description: "Project success criteria"
      }
    }
  },
  // Server adds: path_id, created_at, version
  returns: {
    type: "object",
    properties: {
      path_id: { type: "string" },
      message: { type: "string" }
    }
  }
}
```

### 3. start-tide Tool
```typescript
{
  name: "epic-tide-start-tide", 
  description: "Start a new TIDE execution for a PATH",
  inputSchema: {
    type: "object",
    required: ["path_name"],
    properties: {
      path_name: {
        type: "string",
        description: "Name of PATH to execute"
      },
      adaptations: {
        type: "array",
        items: {
          type: "object",
          required: ["action", "target"],
          properties: {
            action: {
              type: "string",
              enum: ["insert", "modify", "remove", "reorder"]
            },
            target: {
              type: "string",
              description: "Work to adapt"
            },
            details: {
              type: "object"
            }
          }
        },
        description: "Adaptations from previous TIDE (optional)"
      }
    }
  },
  // Server adds: tide_id, attempt, started_at
  returns: {
    type: "object",
    properties: {
      tide_id: { type: "string" },
      attempt: { type: "number" },
      message: { type: "string" }
    }
  }
}
```

### 4. update-tide-execution Tool
```typescript
{
  name: "epic-tide-update-execution",
  description: "Update execution status of a work in current TIDE",
  inputSchema: {
    type: "object",
    required: ["tide_id", "work_name", "status"],
    properties: {
      tide_id: {
        type: "string",
        description: "Current TIDE ID"
      },
      work_name: {
        type: "string",
        description: "Name of work being executed"
      },
      status: {
        type: "string",
        enum: ["complete", "failed", "blocked", "reused"],
        description: "Execution status"
      },
      error: {
        type: "string",
        description: "Error message if failed"
      },
      output: {
        type: "string",
        description: "Execution output/evidence"
      }
    }
  },
  // Server adds: updated_at, duration
  returns: {
    type: "object",
    properties: {
      success: { type: "boolean" },
      message: { type: "string" }
    }
  }
}
```

### 5. complete-tide Tool
```typescript
{
  name: "epic-tide-complete-tide",
  description: "Mark TIDE as complete with outcome and learnings",
  inputSchema: {
    type: "object",
    required: ["tide_id", "outcome"],
    properties: {
      tide_id: {
        type: "string"
      },
      outcome: {
        type: "string",
        enum: ["success", "partial", "failed"]
      },
      metrics_achieved: {
        type: "object",
        additionalProperties: { type: "boolean" },
        description: "Which metrics were achieved"
      },
      learnings: {
        type: "string",
        maxLength: 1000,
        description: "Insights from this execution"
      }
    }
  },
  // Server adds: completed_at, duration
  returns: {
    type: "object",
    properties: {
      success: { type: "boolean" },
      next_action: {
        type: "string",
        enum: ["create_pattern", "retry_tide", "revise_path"]
      }
    }
  }
}
```

### 6. query-patterns Tool
```typescript
{
  name: "epic-tide-query-patterns",
  description: "Find relevant patterns for current context",
  inputSchema: {
    type: "object",
    properties: {
      domain: {
        type: "string",
        description: "Domain to search (e.g., 'rest-api', 'game')"
      },
      tags: {
        type: "array",
        items: { type: "string" },
        description: "Tags to filter by"
      },
      min_success_rate: {
        type: "number",
        minimum: 0,
        maximum: 1,
        description: "Minimum success rate"
      }
    }
  },
  returns: {
    type: "object",
    properties: {
      patterns: {
        type: "array",
        items: {
          type: "object",
          properties: {
            pattern_id: { type: "string" },
            common_sequence: { type: "array" },
            proven_adaptations: { type: "object" },
            success_rate: { type: "number" }
          }
        }
      }
    }
  }
}
```

### 7. get-tide-history Tool
```typescript
{
  name: "epic-tide-get-history",
  description: "Get execution history for a PATH",
  inputSchema: {
    type: "object",
    required: ["path_name"],
    properties: {
      path_name: {
        type: "string",
        description: "PATH to get history for"
      },
      include_execution_details: {
        type: "boolean",
        default: false,
        description: "Include detailed execution logs"
      }
    }
  },
  returns: {
    type: "object",
    properties: {
      tides: {
        type: "array",
        items: {
          type: "object",
          properties: {
            attempt: { type: "number" },
            outcome: { type: "string" },
            learnings: { type: "string" },
            execution: { type: "object" }
          }
        }
      }
    }
  }
}
```

## Usage Flow

### Creating a New Project
```javascript
// 1. Save individual WORKs
await mcp.call("epic-tide-save-work", {
  what: "Setup database",
  how: ["Create schema", "Run migrations"],
  metrics: ["Database accessible"]
});

// 2. Create PATH blueprint
await mcp.call("epic-tide-create-path", {
  what: "Build API",
  works: ["setup-env", "setup-database", "create-api"],
  metrics: ["API running", "Tests pass"]
});

// 3. Start first TIDE
const { tide_id } = await mcp.call("epic-tide-start-tide", {
  path_name: "build-api"
});

// 4. Update execution status
await mcp.call("epic-tide-update-execution", {
  tide_id,
  work_name: "setup-env",
  status: "complete"
});

// 5. Complete TIDE
await mcp.call("epic-tide-complete-tide", {
  tide_id,
  outcome: "partial",
  learnings: "Missing auth configuration"
});
```

## Error Handling

All tools should handle these standard errors:

```typescript
enum ErrorCodes {
  INVALID_STATUS = "Status must be one of: complete, failed, blocked, reused",
  INVALID_OUTCOME = "Outcome must be one of: success, partial, failed",
  PATH_NOT_FOUND = "PATH does not exist",
  TIDE_NOT_ACTIVE = "No active TIDE for this PATH",
  DUPLICATE_WORK = "WORK with this name already exists",
  INVALID_SEQUENCE = "Work sequence contains unknown works"
}
```

## Validation Rules

1. **Work Names**: Must match pattern `^[a-z][a-z0-9-]*$`
2. **Status Values**: Only from EPIC_TIDE_VOCABULARY.yml
3. **Required Fields**: Cannot be empty strings
4. **Array Limits**: Respect min/max items
5. **String Lengths**: Enforce maxLength where specified

## Server Responsibilities

The server MUST:
1. Generate all IDs (work_id, path_id, tide_id)
2. Manage attempt numbers
3. Set all timestamps
4. Calculate durations
5. Maintain referential integrity
6. Validate work references exist
7. Prevent duplicate attempts

## Claude Code Responsibilities

Claude Code MUST:
1. Use vocabulary from EPIC_TIDE_VOCABULARY.yml
2. Provide semantic fields only
3. Not generate IDs or timestamps
4. Follow the execution flow sequentially
5. Capture learnings and adaptations

## Testing Requirements

Each tool needs tests for:
- Valid input acceptance
- Invalid input rejection
- Vocabulary enforcement
- Server field generation
- Error message clarity