import { Router } from 'express';
import { pool } from '../../config/database';
import { generateEmbedding } from '../../services/embedding-mock';

const router = Router();

// POST /api/path.create
router.post('/path.create', async (req, res, next) => {
  try {
    const { what, works, metrics } = req.body;
    
    // Validation
    if (!what || !Array.isArray(works) || !Array.isArray(metrics)) {
      return res.status(400).json({ 
        error: 'Invalid request. Required: what (string), works (array), metrics (array)' 
      });
    }
    
    // Generate embedding
    const whatVector = await generateEmbedding(what);
    
    // Insert with auto-generated ID
    const query = `
      INSERT INTO paths (what, works, metrics, what_vector)
      VALUES ($1, $2, $3, $4)
      RETURNING path_id
    `;
    
    const result = await pool.query(query, [
      what,
      JSON.stringify(works),
      JSON.stringify(metrics),
      whatVector
    ]);
    
    res.json({
      path_id: result.rows[0].path_id,
      message: 'PATH created successfully'
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/path.get
router.post('/path.get', async (req, res, next) => {
  try {
    const { path_id, path_name } = req.body;
    
    if (!path_id && !path_name) {
      return res.status(400).json({ 
        error: 'Either path_id or path_name required' 
      });
    }
    
    let query, params;
    if (path_id) {
      query = 'SELECT * FROM paths WHERE path_id = $1';
      params = [path_id];
    } else {
      // Semantic search by name
      const vector = await generateEmbedding(`query: ${path_name}`);
      query = `
        SELECT *, 1 - (what_vector <=> $1::vector) as similarity
        FROM paths
        WHERE what_vector <=> $1::vector < 0.5
        ORDER BY what_vector <=> $1::vector
        LIMIT 1
      `;
      params = [vector];
    }
    
    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'PATH not found' });
    }
    
    res.json({ path: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// POST /api/path.update
router.post('/path.update', async (req, res, next) => {
  try {
    const { path_id, proven } = req.body;
    
    if (!path_id || proven === undefined) {
      return res.status(400).json({ 
        error: 'path_id and proven status required' 
      });
    }
    
    const query = `
      UPDATE paths 
      SET proven = $1 
      WHERE path_id = $2
      RETURNING path_id
    `;
    
    const result = await pool.query(query, [proven, path_id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'PATH not found' });
    }
    
    res.json({
      path_id: result.rows[0].path_id,
      message: `PATH marked as ${proven ? 'proven' : 'unproven'}`
    });
  } catch (error) {
    next(error);
  }
});

export default router;