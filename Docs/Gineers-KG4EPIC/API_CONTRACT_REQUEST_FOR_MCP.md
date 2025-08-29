# API Contract Request for MCP Server Integration
## Essential Requirements from Backend Team

### Document Purpose
This document specifies the **minimum API contract** required for MCP server integration. The backend team has flexibility in database design and implementation details, but must provide these specific API behaviors.

---

## 1. Core API Contract

### 1.1 Single Endpoint Gateway
- **Endpoint**: `/api/tool`
- **Method**: POST only
- **Purpose**: All MCP operations go through this single endpoint

### 1.2 Request/Response Format (CRITICAL)

#### Request Format (MCP → Backend)
```json
{
  "tool": "tool-name",
  "arguments": {
    // Tool-specific parameters from MCP
  }
}
```

**Important Notes**:
- Field MUST be named `"arguments"` (not `"args"` or `"params"`)
- The `tool` field contains the operation name
- All parameters are nested under `arguments`

#### Response Format (Backend → MCP)
```json
// Success Response
{
  "success": true,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Response content here"
      }
    ]
  }
}

// Error Response
{
  "success": false,
  "error": "Detailed error message",
  "error_code": "OPTIONAL_ERROR_CODE"
}
```

**Critical Requirements**:
- `success` field is REQUIRED (boolean)
- When `success: true`, include `result.content` array
- When `success: false`, include `error` string
- Content must be in the `content` array format shown above

### 1.3 Headers Required
```
Content-Type: application/json
ngrok-skip-browser-warning: true  // If using ngrok
```

---

## 2. Required Tool Operations

The backend must support these tool names through the `/api/tool` endpoint. Internal implementation is flexible, but these operations must work:

### 2.1 Phase Operations
```
- phase-create
- phase-list
- phase-get
- phase-update
- phase-delete (optional)
```

### 2.2 Work Operations (Shared Pool)
```
- work-create
- work-list
- work-get
- work-update
- work-delete (optional)
```

### 2.3 Path Operations
```
- path-create
- path-list
- path-get
- path-update
- path-add-works (link works to paths)
- path-delete (optional)
```

### 2.4 TIDE Operations
```
- tide-create
- tide-update-execution
- tide-complete
- tide-list
- tide-get
```

### 2.5 Pattern Operations
```
- pattern-create
- pattern-list
- pattern-get
- pattern-search
```

### 2.6 Search Operations
```
- search-semantic
- search-hybrid
- search-by-tags
```

### 2.7 Utility Operations
```
- health-check
- validate-structure (optional)
- export-graph (optional)
```

---

## 3. Field Handling Requirements

### 3.1 ID Generation
- **Backend generates all IDs** (don't trust client-provided IDs)
- **Backend generates all timestamps** (created_at, updated_at)
- **Backend manages versions** automatically

### 3.2 Required Field Validation
For each tool, the backend should:
1. Validate required fields are present
2. Return clear error messages for missing fields
3. Example error for missing field:
```json
{
  "success": false,
  "error": "Required field 'phase_id' is missing",
  "error_code": "REQUIRED_FIELD_MISSING"
}
```

### 3.3 Text Fields for Semantic Search
These fields should be stored as searchable text (however you implement it):
- `what` field in phases, works, paths
- `learnings` field in tides
- `for_new_session` field in paths
- Any field that users might search

### 3.4 Structured Data Fields
These fields need structured storage (JSON/JSONB or normalized tables):
- `scope` (in phases)
- `architecture` (in phases)
- `success_criteria` (in phases)
- `metrics` (in works, paths)
- `how` (in works)
- `execution` (in tides)

---

## 4. Example API Calls

### 4.1 Creating a Phase
**Request**:
```bash
curl -X POST https://your-api.com/api/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "phase-create",
    "arguments": {
      "what": "Build MVP for KG4EPIC",
      "scope": {
        "apis": ["CRUD", "Search"],
        "embeddings": ["E5-large-v2"],
        "cost": "FREE"
      },
      "architecture": {
        "storage": "PostgreSQL",
        "api": "RESTful",
        "dims": 1024
      },
      "success_criteria": {
        "api_working": true,
        "search_working": true
      }
    }
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Phase created successfully with ID: phase_1_mvp"
      }
    ],
    "phase_id": "phase_1_mvp"  // Optional: return created ID
  }
}
```

### 4.2 Listing Works
**Request**:
```json
{
  "tool": "work-list",
  "arguments": {
    "limit": 10
  }
}
```

**Expected Response**:
```json
{
  "success": true,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Found 3 works:\n\n1. setup-database-v1: Setup PostgreSQL database\n2. create-api-v1: Create REST API\n3. add-tests-v1: Add test suite"
      }
    ],
    "works": [  // Optional: structured data
      {
        "work_id": "setup-database-v1",
        "what": "Setup PostgreSQL database"
      }
    ]
  }
}
```

### 4.3 Semantic Search
**Request**:
```json
{
  "tool": "search-semantic",
  "arguments": {
    "query": "how to setup authentication",
    "tables": ["works", "patterns"],
    "limit": 5
  }
}
```

**Expected Response**:
```json
{
  "success": true,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Found 2 relevant items:\n\n1. [WORK] setup-auth-v2: Implement JWT authentication\n   Similarity: 0.89\n\n2. [PATTERN] api-auth-pattern: Standard API authentication\n   Similarity: 0.76"
      }
    ]
  }
}
```

---

## 5. Error Handling Requirements

### 5.1 Standard Error Codes
```
REQUIRED_FIELD_MISSING - Required field not provided
INVALID_FIELD_FORMAT - Field format incorrect
ENTITY_NOT_FOUND - Requested item doesn't exist
DUPLICATE_ID - ID already exists
PARENT_NOT_FOUND - Referenced parent doesn't exist
DATABASE_ERROR - Internal database error
VALIDATION_FAILED - Business rule validation failed
```

### 5.2 Error Response Examples
```json
// Missing required field
{
  "success": false,
  "error": "Required field 'what' is missing",
  "error_code": "REQUIRED_FIELD_MISSING"
}

// Entity not found
{
  "success": false,
  "error": "Phase with ID 'phase_99_invalid' not found",
  "error_code": "ENTITY_NOT_FOUND"
}

// Validation error
{
  "success": false,
  "error": "Phase must have at least one API in scope",
  "error_code": "VALIDATION_FAILED"
}
```

---

## 6. Flexibility for Backend Team

### What You CAN Change:
1. **Database structure** - Use any schema that works for you
2. **ID format** - Generate IDs however you want
3. **Internal implementation** - Use any language, framework, database
4. **Additional fields** - Add any fields you need internally
5. **Storage approach** - Normalize, denormalize, use documents, etc.

### What You MUST Keep:
1. **Request/Response format** - Exactly as specified
2. **Tool names** - Must match exactly
3. **Success/error structure** - Must follow the format
4. **Single endpoint** - All operations through `/api/tool`

---

## 7. Testing Checklist

Before declaring the API ready:

### Basic Functionality
- [ ] `/api/tool` endpoint responds to POST requests
- [ ] Request format `{"tool": "...", "arguments": {...}}` works
- [ ] Response includes `success` field
- [ ] Success responses include `result.content` array
- [ ] Error responses include `error` string

### Core Operations
- [ ] phase-create works and returns success
- [ ] phase-list returns existing phases
- [ ] work-create works and returns success
- [ ] path-create works with valid phase_id
- [ ] path-add-works links works to paths
- [ ] tide-create starts execution tracking
- [ ] search operations return results

### Error Handling
- [ ] Missing required fields return clear errors
- [ ] Invalid references return "not found" errors
- [ ] Malformed JSON returns appropriate error

---

## 8. Quick Start for Backend Team

### Step 1: Create the endpoint
```python
# Example in Python/Flask
@app.route('/api/tool', methods=['POST'])
def handle_tool():
    data = request.json
    tool_name = data.get('tool')
    arguments = data.get('arguments', {})
    
    # Route to appropriate handler
    if tool_name == 'phase-create':
        return handle_phase_create(arguments)
    elif tool_name == 'phase-list':
        return handle_phase_list(arguments)
    # ... etc
    
    return {
        "success": False,
        "error": f"Unknown tool: {tool_name}"
    }
```

### Step 2: Implement handlers
```python
def handle_phase_create(args):
    # Your implementation here
    # Validate required fields
    if 'what' not in args:
        return {
            "success": False,
            "error": "Required field 'what' is missing"
        }
    
    # Create phase in your database
    # ...
    
    return {
        "success": True,
        "result": {
            "content": [{
                "type": "text",
                "text": f"Phase created successfully"
            }]
        }
    }
```

### Step 3: Test with curl
```bash
# Test your endpoint
curl -X POST http://localhost:3000/api/tool \
  -H "Content-Type: application/json" \
  -d '{"tool": "health-check", "arguments": {}}'
```

---

## 9. Communication & Support

### Questions?
If anything is unclear:
1. The request/response format is **non-negotiable**
2. The tool names must match **exactly**
3. Everything else is flexible

### Priority Order
1. **Critical**: Get basic CRUD working (create, list, get)
2. **Important**: Add search capabilities
3. **Nice to have**: Advanced features

### Contact
- MCP Team: [Your contact]
- Response format questions: Refer to section 1.2
- Tool list questions: Refer to section 2

---

## 10. Minimum Viable Implementation

If you need to start with the absolute minimum:

### Phase 1: Basic CRUD (Start Here)
```
- phase-create
- phase-list
- phase-get
- work-create
- work-list
- path-create
- health-check
```

### Phase 2: Relationships
```
- path-add-works
- tide-create
- tide-update-execution
```

### Phase 3: Search
```
- search-semantic (even if just text search initially)
```

---

**Document Status**: Ready for Backend Team
**Priority**: HIGH - MCP development blocked until API available
**Estimated Effort**: 2-3 days for basic implementation
**Last Updated**: 2025-08-25