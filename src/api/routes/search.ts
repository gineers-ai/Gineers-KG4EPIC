import { Router } from 'express';
import { Pool } from 'pg';
import { generateEmbedding, checkEmbeddingServiceHealth } from '../../services/embedding';

const router = Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// POST /api/search.semantic
router.post('/search.semantic', async (req, res) => {
  try {
    const { query, entity_type = 'work', limit = 10, threshold = 0.7 } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query required' 
      });
    }
    
    // Check embeddings service health
    const serviceHealthy = await checkEmbeddingServiceHealth();
    if (!serviceHealthy) {
      return res.status(503).json({
        success: false,
        error: 'Embeddings service unavailable'
      });
    }
    
    // Generate query embedding with prefix
    const queryEmbedding = await generateEmbedding(query, 'query');
    
    // Check if we got a valid embedding
    if (queryEmbedding.every(v => v === 0)) {
      return res.status(503).json({
        success: false,
        error: 'Failed to generate embedding'
      });
    }
    
    // Determine table and column based on entity type
    const searchConfigs: Record<string, any> = {
      work: { 
        table: 'works', 
        column: 'what_embedding', 
        fields: 'id, work_id, what, why, how' 
      },
      pattern: { 
        table: 'patterns', 
        column: 'pattern_embedding', 
        fields: 'id, pattern_name, pattern_type, problem_category' 
      }
    };
    
    const config = searchConfigs[entity_type];
    if (!config) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid entity_type. Use "work" or "pattern"' 
      });
    }
    
    // Perform cosine similarity search
    const searchQuery = `
      SELECT 
        ${config.fields},
        1 - (${config.column} <=> $1::vector) as similarity
      FROM ${config.table}
      WHERE ${config.column} IS NOT NULL
        AND 1 - (${config.column} <=> $1::vector) > $2
      ORDER BY similarity DESC
      LIMIT $3
    `;
    
    const result = await pool.query(searchQuery, [
      `[${queryEmbedding.join(',')}]`,
      threshold,
      limit
    ]);
    
    res.json({
      success: true,
      query,
      entity_type,
      results: result.rows,
      count: result.rows.length,
      threshold
    });
    
  } catch (error: any) {
    console.error('Semantic search error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST /api/search.hybrid
router.post('/search.hybrid', async (req, res) => {
  try {
    const { query, filters = {}, limit = 10 } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query required' 
      });
    }
    
    // Generate embedding
    const queryEmbedding = await generateEmbedding(query, 'query');
    
    // Build filter conditions
    let filterConditions = '';
    const filterValues: any[] = [];
    let paramCount = 3;
    
    if (filters.version) {
      filterConditions += ` AND version = $${++paramCount}`;
      filterValues.push(filters.version);
    }
    
    // Hybrid search: semantic + keyword
    const hybridQuery = `
      WITH semantic_results AS (
        SELECT 
          id, work_id, what, why, how,
          1 - (what_embedding <=> $1::vector) as semantic_score
        FROM works
        WHERE what_embedding IS NOT NULL
      ),
      keyword_results AS (
        SELECT 
          id,
          ts_rank(to_tsvector('english', what || ' ' || COALESCE(why, '') || ' ' || COALESCE(how, '')), 
                 plainto_tsquery('english', $2)) as keyword_score
        FROM works
      )
      SELECT 
        w.work_id, w.what, w.why, w.how,
        COALESCE(sr.semantic_score, 0) * 0.7 + 
        COALESCE(kr.keyword_score, 0) * 0.3 as combined_score,
        sr.semantic_score,
        kr.keyword_score
      FROM works w
      LEFT JOIN semantic_results sr ON w.id = sr.id
      LEFT JOIN keyword_results kr ON w.id = kr.id
      WHERE (sr.semantic_score > 0.5 OR kr.keyword_score > 0)
        ${filterConditions}
      ORDER BY combined_score DESC
      LIMIT $3
    `;
    
    const result = await pool.query(hybridQuery, [
      `[${queryEmbedding.join(',')}]`,
      query,
      limit,
      ...filterValues
    ]);
    
    res.json({
      success: true,
      query,
      search_type: 'hybrid',
      results: result.rows,
      count: result.rows.length
    });
    
  } catch (error: any) {
    console.error('Hybrid search error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET /api/search.health
router.get('/search.health', async (req, res) => {
  try {
    const embeddingServiceHealthy = await checkEmbeddingServiceHealth();
    
    // Check if we have any works with embeddings
    const result = await pool.query(`
      SELECT COUNT(*) as count 
      FROM works 
      WHERE what_embedding IS NOT NULL
    `);
    
    res.json({
      success: true,
      embeddings_service: embeddingServiceHealthy ? 'healthy' : 'unavailable',
      indexed_works: parseInt(result.rows[0].count),
      ready: embeddingServiceHealthy
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;