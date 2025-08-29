# KG4EPIC API Integration Examples

## React Integration

### 1. API Client Setup
```typescript
// api/client.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const API_KEY = process.env.REACT_APP_API_KEY || 'your_secure_api_key_here';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error('Authentication failed');
      // Redirect to login or show error
    }
    return Promise.reject(error);
  }
);
```

### 2. Work Service
```typescript
// services/workService.ts
import { apiClient } from '../api/client';

export interface Work {
  work_id: string;
  what: string;
  why?: string;
  how?: string;
  version?: string;
  context?: any;
  knowledge?: any;
}

export class WorkService {
  static async save(work: Work) {
    const response = await apiClient.post('/work.save', work);
    return response.data;
  }

  static async get(workId: string) {
    const response = await apiClient.post('/work.get', { work_id: workId });
    return response.data.work;
  }

  static async list(limit = 100, offset = 0) {
    const response = await apiClient.post('/work.list', { limit, offset });
    return response.data;
  }

  static async delete(workId: string) {
    const response = await apiClient.post('/work.delete', { work_id: workId });
    return response.data;
  }
}
```

### 3. Search Service
```typescript
// services/searchService.ts
import { apiClient } from '../api/client';

export interface SearchOptions {
  query: string;
  entity_type?: 'work' | 'pattern';
  limit?: number;
  threshold?: number;
}

export class SearchService {
  static async semantic(options: SearchOptions) {
    const response = await apiClient.post('/search.semantic', {
      entity_type: 'work',
      limit: 10,
      threshold: 0.7,
      ...options
    });
    return response.data;
  }

  static async hybrid(query: string, filters = {}) {
    const response = await apiClient.post('/search.hybrid', {
      query,
      filters,
      limit: 10
    });
    return response.data;
  }

  static async checkHealth() {
    const response = await apiClient.get('/search.health');
    return response.data;
  }
}
```

### 4. React Hook for Search
```typescript
// hooks/useSemanticSearch.ts
import { useState, useCallback } from 'react';
import { SearchService } from '../services/searchService';

export function useSemanticSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, threshold = 0.7) => {
    if (!query.trim()) {
      setResults([]);
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const data = await SearchService.semantic({
        query,
        entity_type: 'work',
        threshold,
        limit: 10
      });
      
      setResults(data.results || []);
      return data.results || [];
    } catch (err: any) {
      setError(err.message || 'Search failed');
      setResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    search,
    results,
    loading,
    error,
    clear
  };
}
```

### 5. Search Component
```tsx
// components/SemanticSearch.tsx
import React, { useState } from 'react';
import { useSemanticSearch } from '../hooks/useSemanticSearch';

export function SemanticSearch() {
  const [query, setQuery] = useState('');
  const { search, results, loading, error } = useSemanticSearch();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await search(query);
  };

  return (
    <div className="semantic-search">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for works..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="error">{error}</div>
      )}

      {results.length > 0 && (
        <div className="results">
          <h3>Search Results ({results.length})</h3>
          {results.map((work: any) => (
            <div key={work.work_id} className="result-item">
              <h4>{work.work_id}</h4>
              <p>{work.what}</p>
              <small>Similarity: {(work.similarity * 100).toFixed(1)}%</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 6. Work Form Component
```tsx
// components/WorkForm.tsx
import React, { useState } from 'react';
import { WorkService } from '../services/workService';

export function WorkForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    work_id: '',
    what: '',
    why: '',
    how: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await WorkService.save(formData);
      alert('Work saved successfully!');
      
      // Reset form
      setFormData({
        work_id: '',
        what: '',
        why: '',
        how: ''
      });
      
      onSuccess?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Work ID"
        value={formData.work_id}
        onChange={(e) => setFormData({...formData, work_id: e.target.value})}
        required
      />
      
      <textarea
        placeholder="What does this work do?"
        value={formData.what}
        onChange={(e) => setFormData({...formData, what: e.target.value})}
        required
      />
      
      <textarea
        placeholder="Why is this work needed?"
        value={formData.why}
        onChange={(e) => setFormData({...formData, why: e.target.value})}
      />
      
      <textarea
        placeholder="How to implement?"
        value={formData.how}
        onChange={(e) => setFormData({...formData, how: e.target.value})}
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Work'}
      </button>
    </form>
  );
}
```

## Vue.js Integration

### 1. API Service
```javascript
// services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_KEY = import.meta.env.VITE_API_KEY || 'your_secure_api_key_here';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
  }
});

export const workApi = {
  save: (work) => api.post('/work.save', work),
  get: (workId) => api.post('/work.get', { work_id: workId }),
  list: (limit = 100, offset = 0) => api.post('/work.list', { limit, offset }),
  delete: (workId) => api.post('/work.delete', { work_id: workId })
};

export const searchApi = {
  semantic: (query, options = {}) => 
    api.post('/search.semantic', {
      query,
      entity_type: 'work',
      limit: 10,
      threshold: 0.7,
      ...options
    }),
  
  hybrid: (query, filters = {}) =>
    api.post('/search.hybrid', { query, filters, limit: 10 })
};
```

### 2. Vue Composition API
```vue
<!-- components/SemanticSearch.vue -->
<template>
  <div class="semantic-search">
    <form @submit.prevent="handleSearch">
      <input
        v-model="query"
        type="text"
        placeholder="Search for works..."
        :disabled="loading"
      />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Searching...' : 'Search' }}
      </button>
    </form>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="results.length > 0" class="results">
      <h3>Results ({{ results.length }})</h3>
      <div v-for="work in results" :key="work.work_id" class="result">
        <h4>{{ work.work_id }}</h4>
        <p>{{ work.what }}</p>
        <small>Match: {{ (work.similarity * 100).toFixed(1) }}%</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { searchApi } from '../services/api';

const query = ref('');
const results = ref([]);
const loading = ref(false);
const error = ref(null);

const handleSearch = async () => {
  if (!query.value.trim()) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    const response = await searchApi.semantic(query.value);
    results.value = response.data.results || [];
  } catch (err) {
    error.value = err.message;
    results.value = [];
  } finally {
    loading.value = false;
  }
};
</script>
```

## Next.js Integration

### 1. API Route Handler
```typescript
// app/api/kg4epic/route.ts
import { NextRequest, NextResponse } from 'next/server';

const KG4EPIC_API = process.env.KG4EPIC_API_URL || 'http://localhost:3000/api';
const KG4EPIC_KEY = process.env.KG4EPIC_API_KEY || 'your_secure_api_key_here';

export async function POST(request: NextRequest) {
  const { endpoint, ...body } = await request.json();
  
  try {
    const response = await fetch(`${KG4EPIC_API}${endpoint}`, {
      method: 'POST',
      headers: {
        'X-API-Key': KG4EPIC_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'API request failed' },
      { status: 500 }
    );
  }
}
```

### 2. Client Component
```typescript
// app/components/WorkSearch.tsx
'use client';

import { useState } from 'react';

export default function WorkSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/kg4epic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: '/search.semantic',
          query,
          entity_type: 'work',
          limit: 10
        })
      });
      
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && search()}
        placeholder="Search..."
      />
      <button onClick={search} disabled={loading}>
        Search
      </button>
      
      {results.map((work: any) => (
        <div key={work.work_id}>
          <h3>{work.work_id}</h3>
          <p>{work.what}</p>
        </div>
      ))}
    </div>
  );
}
```

## Python Integration

### FastAPI Client
```python
# kg4epic_client.py
import httpx
from typing import Optional, Dict, List

class KG4EPICClient:
    def __init__(self, base_url: str = "http://localhost:3000/api", 
                 api_key: str = "your_secure_api_key_here"):
        self.base_url = base_url
        self.headers = {
            "X-API-Key": api_key,
            "Content-Type": "application/json"
        }
        self.client = httpx.Client(headers=self.headers)
    
    def save_work(self, work_id: str, what: str, 
                  why: Optional[str] = None, 
                  how: Optional[str] = None) -> Dict:
        """Save a work item with automatic embedding generation."""
        response = self.client.post(
            f"{self.base_url}/work.save",
            json={
                "work_id": work_id,
                "what": what,
                "why": why,
                "how": how
            }
        )
        response.raise_for_status()
        return response.json()
    
    def semantic_search(self, query: str, 
                       limit: int = 10, 
                       threshold: float = 0.7) -> List[Dict]:
        """Search for works using semantic similarity."""
        response = self.client.post(
            f"{self.base_url}/search.semantic",
            json={
                "query": query,
                "entity_type": "work",
                "limit": limit,
                "threshold": threshold
            }
        )
        response.raise_for_status()
        return response.json().get("results", [])
    
    def close(self):
        """Close the HTTP client."""
        self.client.close()

# Usage example
if __name__ == "__main__":
    client = KG4EPICClient()
    
    # Save a work
    result = client.save_work(
        work_id="python-integration",
        what="Integrate KG4EPIC API with Python",
        why="Enable Python applications to use EPIC-TIDE"
    )
    print(f"Saved: {result}")
    
    # Search for related works
    results = client.semantic_search("python api integration")
    for work in results:
        print(f"- {work['work_id']}: {work['similarity']:.2f}")
    
    client.close()
```

## Mobile (React Native)

```typescript
// services/kg4epicService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://your-server:3000/api';
const API_KEY = 'your_secure_api_key_here';

class KG4EPICService {
  private async request(endpoint: string, data: any) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async saveWork(work: any) {
    const result = await this.request('/work.save', work);
    
    // Cache locally for offline access
    const cached = await AsyncStorage.getItem('cached_works') || '[]';
    const works = JSON.parse(cached);
    works.push(work);
    await AsyncStorage.setItem('cached_works', JSON.stringify(works));
    
    return result;
  }

  async search(query: string) {
    try {
      return await this.request('/search.semantic', {
        query,
        entity_type: 'work',
        limit: 10
      });
    } catch (error) {
      // Fallback to cached data if offline
      const cached = await AsyncStorage.getItem('cached_works') || '[]';
      const works = JSON.parse(cached);
      
      // Simple local search
      return {
        results: works.filter((w: any) => 
          w.what.toLowerCase().includes(query.toLowerCase())
        ),
        offline: true
      };
    }
  }
}

export default new KG4EPICService();
```

## Testing

### Jest Test Example
```typescript
// __tests__/api.test.ts
import { apiClient } from '../api/client';
import { WorkService } from '../services/workService';

describe('KG4EPIC API', () => {
  test('should save and retrieve work', async () => {
    // Save work
    const work = {
      work_id: 'test-' + Date.now(),
      what: 'Test work',
      why: 'Testing'
    };
    
    const saveResult = await WorkService.save(work);
    expect(saveResult.success).toBe(true);
    expect(saveResult.work_id).toBe(work.work_id);
    
    // Retrieve work
    const retrieved = await WorkService.get(work.work_id);
    expect(retrieved.what).toBe(work.what);
    
    // Clean up
    await WorkService.delete(work.work_id);
  });
  
  test('should find work by semantic search', async () => {
    // Create test work
    const work = {
      work_id: 'search-test-' + Date.now(),
      what: 'Implement user authentication with JWT tokens'
    };
    await WorkService.save(work);
    
    // Wait for embeddings
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Search
    const response = await apiClient.post('/search.semantic', {
      query: 'user login security',
      entity_type: 'work'
    });
    
    expect(response.data.success).toBe(true);
    expect(response.data.results.length).toBeGreaterThan(0);
    
    // Clean up
    await WorkService.delete(work.work_id);
  });
});
```

## Error Handling Best Practices

```typescript
// utils/apiErrorHandler.ts
export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message);
  }
}

export function handleAPIError(error: any): APIError {
  if (error.response) {
    // Server responded with error
    return new APIError(
      error.response.status,
      error.response.data?.error || 'Request failed',
      error.response.data
    );
  } else if (error.request) {
    // No response received
    return new APIError(0, 'Network error - no response');
  } else {
    // Request setup error
    return new APIError(0, error.message);
  }
}

// Usage
try {
  const result = await WorkService.save(work);
} catch (error) {
  const apiError = handleAPIError(error);
  
  if (apiError.status === 401) {
    // Handle auth error
  } else if (apiError.status === 400) {
    // Handle validation error
  } else {
    // Handle other errors
  }
}
```