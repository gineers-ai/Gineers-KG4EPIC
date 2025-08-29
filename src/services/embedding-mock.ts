// Mock embedding service for Docker testing
// Returns random 1024-dimensional vectors

const embeddingCache = new Map<string, number[]>();

export async function initEmbedder() {
  console.log('📊 Using mock embeddings for testing');
}

export async function generateEmbedding(text: string): Promise<number[]> {
  // Check cache first
  if (embeddingCache.has(text)) {
    return embeddingCache.get(text)!;
  }
  
  // Generate mock 1024-dimensional vector
  const embedding = Array.from({ length: 1024 }, () => Math.random() * 0.1 - 0.05);
  
  // Cache for consistency
  embeddingCache.set(text, embedding);
  
  return embedding;
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  return Promise.all(texts.map(text => generateEmbedding(text)));
}