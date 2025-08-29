import axios from 'axios';

// Use embeddings service instead of local transformers
const EMBEDDINGS_SERVICE_URL = process.env.EMBEDDINGS_SERVICE_URL || 'http://embeddings:8000';
const embeddingCache = new Map<string, number[]>();

export async function generateEmbedding(text: string, prefix?: 'query' | 'passage'): Promise<number[]> {
  // Check cache first
  const cacheKey = prefix ? `${prefix}: ${text}` : text;
  if (embeddingCache.has(cacheKey)) {
    return embeddingCache.get(cacheKey)!;
  }
  
  try {
    const response = await axios.post(`${EMBEDDINGS_SERVICE_URL}/embed`, {
      text,
      prefix
    });
    
    const embedding = response.data.embedding;
    
    // Cache for reuse
    embeddingCache.set(cacheKey, embedding);
    
    return embedding;
  } catch (error: any) {
    console.error('Embedding service error:', error.message);
    // Return zero vector as fallback
    return new Array(1024).fill(0);
  }
}

// Batch processing for efficiency
export async function generateEmbeddings(texts: string[], prefix?: 'query' | 'passage'): Promise<number[][]> {
  try {
    const response = await axios.post(`${EMBEDDINGS_SERVICE_URL}/embed/batch`, {
      texts,
      prefix
    });
    
    return response.data.embeddings;
  } catch (error: any) {
    console.error('Batch embedding service error:', error.message);
    // Return zero vectors as fallback
    return texts.map(() => new Array(1024).fill(0));
  }
}

// Health check for embeddings service
export async function checkEmbeddingServiceHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${EMBEDDINGS_SERVICE_URL}/health`);
    return response.data.status === 'healthy';
  } catch (error) {
    console.error('Embeddings service not available');
    return false;
  }
}