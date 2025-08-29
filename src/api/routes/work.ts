import { Router } from 'express';
import { pool } from '../../config/database';
import { generateEmbedding, generateEmbeddings } from '../../services/embedding';

const router = Router();

// POST /api/work.save
router.post('/work.save', async (req, res, next) => {
  try {
    const { work_id, what, why, how, version = '1.0', context, knowledge, artifacts, troubleshooting, learnings } = req.body;
    
    // Basic validation
    if (!work_id || !what) {
      return res.status(400).json({ 
        error: 'Invalid request. Required: work_id, what' 
      });
    }
    
    // Generate embeddings for semantic fields
    const embeddings = await generateEmbeddings(
      [
        what,
        why || '',
        knowledge ? JSON.stringify(knowledge) : ''
      ].filter(Boolean),
      'passage'
    );
    
    const [whatEmbedding, whyEmbedding, knowledgeEmbedding] = embeddings;
    
    // Upsert work
    const query = `
      INSERT INTO works (
        work_id, what, why, how, version,
        context, knowledge, artifacts, troubleshooting, learnings,
        what_embedding, why_embedding, knowledge_embedding
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (work_id) DO UPDATE SET
        what = EXCLUDED.what,
        why = EXCLUDED.why,
        how = EXCLUDED.how,
        version = EXCLUDED.version,
        context = EXCLUDED.context,
        knowledge = EXCLUDED.knowledge,
        artifacts = EXCLUDED.artifacts,
        troubleshooting = EXCLUDED.troubleshooting,
        learnings = EXCLUDED.learnings,
        what_embedding = EXCLUDED.what_embedding,
        why_embedding = EXCLUDED.why_embedding,
        knowledge_embedding = EXCLUDED.knowledge_embedding,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, work_id
    `;
    
    const result = await pool.query(query, [
      work_id,
      what,
      why,
      how,
      version,
      context ? JSON.stringify(context) : null,
      knowledge ? JSON.stringify(knowledge) : null,
      artifacts ? JSON.stringify(artifacts) : null,
      troubleshooting ? JSON.stringify(troubleshooting) : null,
      learnings ? JSON.stringify(learnings) : null,
      whatEmbedding ? `[${whatEmbedding.join(',')}]` : null,
      whyEmbedding && why ? `[${whyEmbedding.join(',')}]` : null,
      knowledgeEmbedding && knowledge ? `[${knowledgeEmbedding.join(',')}]` : null
    ]);
    
    res.json({
      success: true,
      id: result.rows[0].id,
      work_id: result.rows[0].work_id,
      message: 'Work saved successfully'
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/work.get
router.post('/work.get', async (req, res, next) => {
  try {
    const { work_id } = req.body;
    
    if (!work_id) {
      return res.status(400).json({ 
        error: 'work_id is required' 
      });
    }
    
    const query = `
      SELECT 
        id, work_id, what, why, how, version,
        context, knowledge, artifacts, troubleshooting, learnings,
        created_at, updated_at
      FROM works
      WHERE work_id = $1
    `;
    
    const result = await pool.query(query, [work_id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Work not found'
      });
    }
    
    res.json({
      success: true,
      work: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/work.list
router.post('/work.list', async (req, res, next) => {
  try {
    const { limit = 100, offset = 0 } = req.body;
    
    const query = `
      SELECT 
        id, work_id, what, why, version,
        created_at, updated_at
      FROM works
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const result = await pool.query(query, [limit, offset]);
    
    res.json({
      success: true,
      works: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/work.delete
router.post('/work.delete', async (req, res, next) => {
  try {
    const { work_id } = req.body;
    
    if (!work_id) {
      return res.status(400).json({ 
        error: 'work_id is required' 
      });
    }
    
    const query = 'DELETE FROM works WHERE work_id = $1 RETURNING id';
    const result = await pool.query(query, [work_id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Work not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Work deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;