# KG4EPIC API Usage Guide

## Overview
KG4EPIC provides a POST-only REST API for managing EPIC-TIDE methodology data with semantic search capabilities.

## Base Configuration

### API Endpoint
```
Base URL: http://localhost:3000/api
```

### Authentication
All API requests require an API key in the header:
```http
X-API-Key: your_secure_api_key_here
```

### Request Format
- **Method**: POST only (all endpoints)
- **Content-Type**: application/json
- **Body**: JSON payload

## Core Endpoints

### 1. Work Management

#### Create/Update Work
```http
POST /api/work.save
```

**Request Body:**
```json
{
  "work_id": "unique-work-id",
  "what": "Description of what this work does",
  "why": "Reason for this work",
  "how": "How to implement this work",
  "version": "1.0",
  "context": {
    "background": "Additional context",
    "dependencies": ["dep1", "dep2"]
  },
  "knowledge": {
    "key_concepts": ["concept1", "concept2"],
    "references": ["ref1", "ref2"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "id": "uuid-here",
  "work_id": "unique-work-id",
  "message": "Work saved successfully"
}
```

**Note:** This endpoint automatically generates embeddings for semantic search.

#### Get Work
```http
POST /api/work.get
```

**Request Body:**
```json
{
  "work_id": "unique-work-id"
}
```

**Response:**
```json
{
  "success": true,
  "work": {
    "id": "uuid",
    "work_id": "unique-work-id",
    "what": "Description",
    "why": "Reason",
    "how": "Implementation",
    "context": {},
    "knowledge": {},
    "created_at": "2025-01-28T10:00:00Z",
    "updated_at": "2025-01-28T10:00:00Z"
  }
}
```

#### List Works
```http
POST /api/work.list
```

**Request Body:**
```json
{
  "limit": 100,
  "offset": 0
}
```

**Response:**
```json
{
  "success": true,
  "works": [
    {
      "id": "uuid",
      "work_id": "work-1",
      "what": "Description",
      "why": "Reason",
      "version": "1.0",
      "created_at": "2025-01-28T10:00:00Z"
    }
  ],
  "count": 1
}
```

#### Delete Work
```http
POST /api/work.delete
```

**Request Body:**
```json
{
  "work_id": "unique-work-id"
}
```

### 2. Semantic Search

#### Semantic Search
Find relevant items using AI-powered semantic similarity.

```http
POST /api/search.semantic
```

**Request Body:**
```json
{
  "query": "your search query here",
  "entity_type": "work",
  "limit": 10,
  "threshold": 0.7
}
```

**Parameters:**
- `query`: Natural language search query
- `entity_type`: Type to search ("work" or "pattern")
- `limit`: Max results to return (default: 10)
- `threshold`: Minimum similarity score 0-1 (default: 0.7)

**Response:**
```json
{
  "success": true,
  "query": "your search query",
  "entity_type": "work",
  "results": [
    {
      "work_id": "matching-work",
      "what": "Work description",
      "why": "Work reason",
      "similarity": 0.85
    }
  ],
  "count": 1
}
```

#### Hybrid Search
Combines semantic search with keyword matching for best results.

```http
POST /api/search.hybrid
```

**Request Body:**
```json
{
  "query": "typescript node setup",
  "limit": 10,
  "filters": {
    "version": "1.0"
  }
}
```

**Response:**
```json
{
  "success": true,
  "query": "typescript node setup",
  "search_type": "hybrid",
  "results": [
    {
      "work_id": "nodejs-typescript-setup",
      "what": "Setup Node.js with TypeScript",
      "why": "Type safety for backend",
      "combined_score": 0.82,
      "semantic_score": 0.85,
      "keyword_score": 0.75
    }
  ],
  "count": 1
}
```

#### Search Health Check
```http
GET /api/search.health
```

**Response:**
```json
{
  "success": true,
  "embeddings_service": "healthy",
  "indexed_works": 42,
  "ready": true
}
```

### 3. Path Management

#### Create/Update Path
```http
POST /api/path.save
```

**Request Body:**
```json
{
  "path_id": "unique-path-id",
  "phase_id": "phase-uuid",
  "what": "Path description",
  "version": "1.0",
  "project": {
    "name": "Project name",
    "scope": "Project scope"
  },
  "decisions": {
    "approach": "Selected approach",
    "rationale": "Why this approach"
  }
}
```

#### Get Path
```http
POST /api/path.get
```

**Request Body:**
```json
{
  "path_id": "unique-path-id"
}
```

### 4. TIDE Management

#### Create TIDE
```http
POST /api/tide.create
```

**Request Body:**
```json
{
  "path_id": "path-uuid",
  "tide_number": 1,
  "context": {
    "starting_point": "Current state",
    "goals": ["goal1", "goal2"]
  }
}
```

#### Update TIDE
```http
POST /api/tide.update
```

**Request Body:**
```json
{
  "tide_id": "tide-uuid",
  "outcome": "success",
  "execution": {
    "steps_taken": ["step1", "step2"],
    "results": "What was achieved"
  },
  "learnings": {
    "technical": ["learning1"],
    "process": ["learning2"]
  }
}
```

## Error Handling

All endpoints return consistent error responses:

### Authentication Error
```json
{
  "error": "API key required"
}
```
**Status Code:** 401

### Validation Error
```json
{
  "error": "Invalid request. Required: work_id, what"
}
```
**Status Code:** 400

### Not Found Error
```json
{
  "success": false,
  "error": "Work not found"
}
```
**Status Code:** 404

### Server Error
```json
{
  "success": false,
  "error": "Internal server error message"
}
```
**Status Code:** 500

## Usage Examples

### JavaScript/TypeScript Example
```typescript
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';
const API_KEY = 'your_secure_api_key_here';

// Create axios instance with default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
  }
});

// Save a work
async function saveWork(work: any) {
  try {
    const response = await api.post('/work.save', work);
    return response.data;
  } catch (error) {
    console.error('Error saving work:', error);
    throw error;
  }
}

// Search for relevant works
async function searchWorks(query: string) {
  try {
    const response = await api.post('/search.semantic', {
      query,
      entity_type: 'work',
      limit: 10,
      threshold: 0.7
    });
    return response.data.results;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}
```

### React Hook Example
```typescript
import { useState, useCallback } from 'react';
import { api } from './api-client';

export function useSemanticSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const search = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/search.semantic', {
        query,
        entity_type: 'work',
        limit: 10
      });
      
      setResults(response.data.results);
      return response.data.results;
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { search, results, loading, error };
}
```

### cURL Examples
```bash
# Save a work
curl -X POST http://localhost:3000/api/work.save \
  -H "X-API-Key: your_secure_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "work_id": "test-work",
    "what": "Test work description",
    "why": "Testing the API"
  }'

# Semantic search
curl -X POST http://localhost:3000/api/search.semantic \
  -H "X-API-Key: your_secure_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "nodejs typescript setup",
    "entity_type": "work",
    "limit": 5
  }'
```

## Best Practices

### 1. Error Handling
Always wrap API calls in try-catch blocks and handle errors gracefully:
```typescript
try {
  const result = await api.post('/work.save', data);
  // Handle success
} catch (error) {
  if (error.response?.status === 401) {
    // Handle authentication error
  } else if (error.response?.status === 400) {
    // Handle validation error
  } else {
    // Handle other errors
  }
}
```

### 2. Pagination
For listing endpoints, use pagination to manage large datasets:
```typescript
const PAGE_SIZE = 20;
let offset = 0;

async function loadNextPage() {
  const response = await api.post('/work.list', {
    limit: PAGE_SIZE,
    offset: offset
  });
  offset += PAGE_SIZE;
  return response.data;
}
```

### 3. Search Optimization
- Use specific, descriptive queries for better results
- Adjust threshold based on your needs (0.7-0.8 for high relevance)
- Use hybrid search when you need both semantic and keyword matching

### 4. Caching
Consider caching frequently accessed data:
```typescript
const cache = new Map();

async function getWork(workId: string) {
  if (cache.has(workId)) {
    return cache.get(workId);
  }
  
  const response = await api.post('/work.get', { work_id: workId });
  cache.set(workId, response.data.work);
  return response.data.work;
}
```

## Rate Limiting
The API implements rate limiting:
- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Status Code**: 429 when limit exceeded

## Environment Setup

### Development
```env
API_URL=http://localhost:3000/api
API_KEY=your_secure_api_key_here
```

### Docker Setup
The API runs in a Docker container. To access from host:
```
http://localhost:3000/api
```

To access from another container in the same network:
```
http://kg4epic-api:3000/api
```

## Testing the API

### Quick Health Check
```bash
# Check if API is running (requires auth)
curl -H "X-API-Key: your_secure_api_key_here" \
  http://localhost:3000/api/search.health
```

### Test Search Functionality
1. First, create some test data
2. Wait a moment for embeddings to generate
3. Search for related content

## Troubleshooting

### Common Issues

#### 1. "API key required"
**Solution**: Ensure you're including the X-API-Key header in all requests

#### 2. "Embeddings service unavailable"
**Solution**: Check that the embeddings Docker container is running:
```bash
docker ps | grep kg4epic-embeddings
```

#### 3. No search results
**Possible causes**:
- Threshold too high (try lowering to 0.5)
- No data with embeddings yet
- Query too specific or unrelated

#### 4. Slow search performance
**Solutions**:
- Ensure vector indexes are created in database
- Limit search results with appropriate `limit` parameter
- Use hybrid search for better performance with keywords

## Support

For issues or questions:
1. Check the Docker logs: `docker logs kg4epic-api`
2. Verify all services are running: `docker ps`
3. Run verification script: `./verify-tide2.sh`

## API Version
Current Version: 1.0
EPIC-TIDE Methodology: v5.1