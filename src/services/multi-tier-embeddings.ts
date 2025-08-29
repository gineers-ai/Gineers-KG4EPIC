import axios from 'axios';

const EMBEDDINGS_E5_URL = process.env.EMBEDDINGS_SERVICE_URL || 'http://embeddings:8000';
const EMBEDDINGS_ADA002_URL = process.env.EMBEDDINGS_ADA002_URL || 'http://embeddings-ada002:8001';

export interface MultiTierEmbedding {
  e5: number[];
  ada002: number[];
  e5_dimension: number;
  ada002_dimension: number;
}

export interface MultiTierBatchResult {
  embeddings: MultiTierEmbedding[];
  count: number;
  e5_tokens?: number;
  ada002_tokens?: number;
}

export async function generateMultiTierEmbedding(
  text: string, 
  prefix?: 'query' | 'passage'
): Promise<MultiTierEmbedding> {
  const [e5Response, ada002Response] = await Promise.all([
    axios.post(`${EMBEDDINGS_E5_URL}/embed`, {
      text,
      prefix
    }),
    axios.post(`${EMBEDDINGS_ADA002_URL}/embed`, {
      text,
      model: 'text-embedding-ada-002'
    })
  ]);

  return {
    e5: e5Response.data.embedding,
    ada002: ada002Response.data.embedding,
    e5_dimension: e5Response.data.dimension || 1024,
    ada002_dimension: ada002Response.data.dimension || 1536
  };
}

export async function generateMultiTierBatch(
  texts: string[],
  prefix?: 'query' | 'passage'
): Promise<MultiTierBatchResult> {
  const [e5Response, ada002Response] = await Promise.all([
    axios.post(`${EMBEDDINGS_E5_URL}/embed/batch`, {
      texts,
      prefix
    }),
    axios.post(`${EMBEDDINGS_ADA002_URL}/embed/batch`, {
      texts,
      model: 'text-embedding-ada-002'
    })
  ]);

  const embeddings: MultiTierEmbedding[] = texts.map((_, index) => ({
    e5: e5Response.data.embeddings[index],
    ada002: ada002Response.data.embeddings[index],
    e5_dimension: 1024,
    ada002_dimension: 1536
  }));

  return {
    embeddings,
    count: embeddings.length,
    e5_tokens: e5Response.data.total_tokens,
    ada002_tokens: ada002Response.data.total_tokens
  };
}

export async function checkMultiTierHealth(): Promise<{
  e5: boolean;
  ada002: boolean;
  fully_operational: boolean;
}> {
  const [e5Health, ada002Health] = await Promise.allSettled([
    axios.get(`${EMBEDDINGS_E5_URL}/health`),
    axios.get(`${EMBEDDINGS_ADA002_URL}/health`)
  ]);

  const e5Healthy = e5Health.status === 'fulfilled' && 
                    e5Health.value.data.status === 'healthy';
  const ada002Healthy = ada002Health.status === 'fulfilled' && 
                        ada002Health.value.data.status === 'healthy';

  return {
    e5: e5Healthy,
    ada002: ada002Healthy,
    fully_operational: e5Healthy && ada002Healthy
  };
}

export async function compareTexts(
  text1: string,
  text2: string,
  tier: 'e5' | 'ada002' | 'both' = 'both'
): Promise<{
  e5_similarity?: number;
  ada002_similarity?: number;
  combined_similarity?: number;
  interpretation: string;
}> {
  const [emb1, emb2] = await Promise.all([
    generateMultiTierEmbedding(text1),
    generateMultiTierEmbedding(text2)
  ]);

  const cosineSimilarity = (a: number[], b: number[]): number => {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  };

  const result: any = {};

  if (tier === 'e5' || tier === 'both') {
    result.e5_similarity = cosineSimilarity(emb1.e5, emb2.e5);
  }

  if (tier === 'ada002' || tier === 'both') {
    result.ada002_similarity = cosineSimilarity(emb1.ada002, emb2.ada002);
  }

  if (tier === 'both') {
    result.combined_similarity = (result.e5_similarity * 0.4 + result.ada002_similarity * 0.6);
    const score = result.combined_similarity;
    result.interpretation = score > 0.9 ? 'Very similar' :
                           score > 0.7 ? 'Similar' :
                           score > 0.5 ? 'Somewhat related' : 'Different';
  } else {
    const score = result.e5_similarity || result.ada002_similarity;
    result.interpretation = score > 0.9 ? 'Very similar' :
                           score > 0.7 ? 'Similar' :
                           score > 0.5 ? 'Somewhat related' : 'Different';
  }

  return result;
}