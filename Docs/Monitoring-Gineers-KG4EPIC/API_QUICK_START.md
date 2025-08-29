# KG4EPIC API Quick Start Guide

## 🚀 5-Minute Setup

### Prerequisites
- Docker installed and running
- Node.js (for testing) or any HTTP client
- API Key: `your_secure_api_key_here`

### Step 1: Verify Services
```bash
# Check if all containers are running
docker ps | grep kg4epic

# Should see:
# kg4epic-api         (Port 3000)
# kg4epic-postgres    (Port 5432)  
# kg4epic-embeddings  (Port 8000)
```

### Step 2: Test Connection
```bash
# Test API health (with auth)
curl -H "X-API-Key: your_secure_api_key_here" \
  http://localhost:3000/api/search.health
```

Expected response:
```json
{
  "success": true,
  "embeddings_service": "healthy",
  "indexed_works": 4,
  "ready": true
}
```

## 📝 Basic Operations

### 1. Save Your First Work
```javascript
const API_URL = 'http://localhost:3000/api';
const headers = {
  'X-API-Key': 'your_secure_api_key_here',
  'Content-Type': 'application/json'
};

// Save a work item
fetch(`${API_URL}/work.save`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    work_id: 'my-first-work',
    what: 'Create user authentication system',
    why: 'Secure the application endpoints',
    how: 'Implement JWT tokens with refresh mechanism'
  })
})
.then(res => res.json())
.then(data => console.log('Work saved:', data));
```

### 2. Search for Works
```javascript
// Semantic search - finds related content
fetch(`${API_URL}/search.semantic`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    query: 'user login security',
    entity_type: 'work',
    limit: 5
  })
})
.then(res => res.json())
.then(data => {
  console.log(`Found ${data.count} results:`);
  data.results.forEach(work => {
    console.log(`- ${work.work_id}: ${work.what} (${work.similarity.toFixed(2)})`);
  });
});
```

### 3. Get a Specific Work
```javascript
fetch(`${API_URL}/work.get`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    work_id: 'my-first-work'
  })
})
.then(res => res.json())
.then(data => console.log('Work details:', data.work));
```

## 🎯 Key Features

### Semantic Search
- **What it does**: Finds content by meaning, not just keywords
- **Example**: Searching for "user authentication" will find works about "login system", "JWT tokens", "security"
- **Accuracy**: Typically >0.8 similarity for relevant matches

### Hybrid Search
- **What it does**: Combines AI semantic search with traditional keyword search
- **When to use**: When you want both conceptual matches and exact term matches
- **Better for**: Technical terms, acronyms, specific technologies

## 🔑 Important Notes

### All Endpoints are POST
Even reading operations use POST method:
```javascript
// ✅ Correct
fetch('/api/work.get', { method: 'POST', ... })

// ❌ Wrong
fetch('/api/work.get', { method: 'GET', ... })
```

### Authentication Required
Every request needs the API key:
```javascript
headers: {
  'X-API-Key': 'your_secure_api_key_here'
}
```

### Response Format
All responses follow this pattern:
```json
{
  "success": true|false,
  "data": {...} | "error": "message"
}
```

## 📊 Response Examples

### Successful Work Save
```json
{
  "success": true,
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "work_id": "my-work",
  "message": "Work saved successfully"
}
```

### Semantic Search Results
```json
{
  "success": true,
  "query": "authentication",
  "results": [
    {
      "work_id": "jwt-auth",
      "what": "Implement JWT authentication",
      "similarity": 0.89
    },
    {
      "work_id": "oauth-setup",
      "what": "Setup OAuth2 integration",
      "similarity": 0.76
    }
  ],
  "count": 2
}
```

### Error Response
```json
{
  "success": false,
  "error": "Work not found"
}
```

## 🛠 Troubleshooting

| Problem | Solution |
|---------|----------|
| "API key required" | Add `X-API-Key` header to request |
| No search results | Lower threshold from 0.7 to 0.5 |
| "Embeddings service unavailable" | Check Docker: `docker ps` |
| Connection refused | Ensure port 3000 is not blocked |

## 📚 Full Documentation

For complete API documentation, see: [API_USAGE_GUIDE.md](./API_USAGE_GUIDE.md)

## 🏃‍♂️ Next Steps

1. **Create Works**: Start populating your knowledge base
2. **Test Search**: Try different queries to see semantic matching
3. **Build UI**: Create a front-end interface for the API
4. **Add Patterns**: Extract and store patterns from TIDEs

## 💡 Pro Tips

1. **Better Search Results**: Use descriptive, specific queries
2. **Performance**: Cache frequently accessed works
3. **Batch Operations**: Save multiple works, then search
4. **Similarity Threshold**: 
   - 0.9+ = Nearly identical
   - 0.8+ = Very similar
   - 0.7+ = Related
   - 0.5+ = Loosely related