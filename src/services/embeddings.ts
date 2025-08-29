// Embeddings service - Dual strategy (E5 for light, Ada-002 for heavy)
import fetch from 'node-fetch';

interface EmbeddingInput {
  light?: string;  // For E5-large-v2 (1024 dims)
  heavy?: string;  // For text-embedding-ada-002 (1536 dims)
}

interface EmbeddingOutput {
  light?: number[];
  heavy?: number[];
}

// Generate embeddings using dual strategy
export async function generateEmbeddings(input: EmbeddingInput): Promise<EmbeddingOutput> {
  const output: EmbeddingOutput = {};

  // Generate E5 embeddings for light fields
  if (input.light) {
    try {
      const response = await fetch('http://embeddings:8000/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input.light })
      });

      if (response.ok) {
        const data = await response.json();
        output.light = data.embedding;
      } else {
        console.error('E5 embedding failed:', response.statusText);
        // Use mock embedding as fallback
        output.light = Array(1024).fill(0).map(() => Math.random() * 0.1);
      }
    } catch (error) {
      console.error('E5 service error:', error);
      // Use mock embedding as fallback
      output.light = Array(1024).fill(0).map(() => Math.random() * 0.1);
    }
  }

  // Generate Ada-002 embeddings for heavy fields
  if (input.heavy) {
    try {
      const response = await fetch('http://embeddings-ada002:8001/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input.heavy })
      });

      if (response.ok) {
        const data = await response.json();
        output.heavy = data.embedding;
      } else {
        console.error('Ada-002 embedding failed:', response.statusText);
        // Use mock embedding as fallback
        output.heavy = Array(1536).fill(0).map(() => Math.random() * 0.1);
      }
    } catch (error) {
      console.error('Ada-002 service error:', error);
      // Use mock embedding as fallback
      output.heavy = Array(1536).fill(0).map(() => Math.random() * 0.1);
    }
  }

  return output;
}

// Batch embedding generation
export async function generateBatchEmbeddings(
  inputs: EmbeddingInput[]
): Promise<EmbeddingOutput[]> {
  return Promise.all(inputs.map(input => generateEmbeddings(input)));
}

// Compare two embeddings using cosine similarity
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Embeddings must have the same dimension');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}