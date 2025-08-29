import { Router } from 'express';
import { pool } from '../../config/database';
import { generateEmbedding } from '../../services/embedding-mock';

const router = Router();

// POST /api/tide.start
router.post('/tide.start', async (req, res, next) => {
  try {
    const { path_id, adaptations = {} } = req.body;
    
    if (!path_id) {
      return res.status(400).json({ error: 'path_id required' });
    }
    
    // Get latest attempt number for this path
    const attemptQuery = `
      SELECT COALESCE(MAX(attempt), 0) + 1 as next_attempt
      FROM tides
      WHERE path_id = $1
    `;
    
    const attemptResult = await pool.query(attemptQuery, [path_id]);
    const nextAttempt = attemptResult.rows[0].next_attempt;
    
    // Create new TIDE
    const query = `
      INSERT INTO tides (path_id, attempt, execution, adaptations)
      VALUES ($1, $2, $3, $4)
      RETURNING tide_id, attempt
    `;
    
    const result = await pool.query(query, [
      path_id,
      nextAttempt,
      JSON.stringify({}), // Empty execution to start
      JSON.stringify(adaptations)
    ]);
    
    res.json({
      tide_id: result.rows[0].tide_id,
      attempt: result.rows[0].attempt,
      message: 'TIDE started successfully'
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/tide.update
router.post('/tide.update', async (req, res, next) => {
  try {
    const { tide_id, work_name, status, error, output } = req.body;
    
    if (!tide_id || !work_name || !status) {
      return res.status(400).json({ 
        error: 'tide_id, work_name, and status required' 
      });
    }
    
    // Get current execution state
    const getQuery = 'SELECT execution FROM tides WHERE tide_id = $1';
    const current = await pool.query(getQuery, [tide_id]);
    
    if (current.rows.length === 0) {
      return res.status(404).json({ error: 'TIDE not found' });
    }
    
    // Update execution state
    const execution = current.rows[0].execution;
    execution[work_name] = {
      status,
      timestamp: new Date().toISOString(),
      error: error || null,
      output: output || null
    };
    
    // Update database
    const updateQuery = `
      UPDATE tides 
      SET execution = $1
      WHERE tide_id = $2
    `;
    
    await pool.query(updateQuery, [JSON.stringify(execution), tide_id]);
    
    res.json({
      success: true,
      message: `TIDE updated: ${work_name} -> ${status}`
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/tide.complete
router.post('/tide.complete', async (req, res, next) => {
  try {
    const { tide_id, outcome, learnings, metrics_achieved } = req.body;
    
    if (!tide_id || !outcome) {
      return res.status(400).json({ 
        error: 'tide_id and outcome required' 
      });
    }
    
    // Generate learnings vector if provided
    let learningsVector = null;
    if (learnings) {
      learningsVector = await generateEmbedding(learnings);
    }
    
    // Update TIDE
    const query = `
      UPDATE tides 
      SET outcome = $1, 
          learnings = $2,
          learnings_vector = $3,
          metrics_achieved = $4,
          completed_at = NOW()
      WHERE tide_id = $5
      RETURNING tide_id
    `;
    
    const result = await pool.query(query, [
      outcome,
      learnings,
      learningsVector,
      JSON.stringify(metrics_achieved || {}),
      tide_id
    ]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'TIDE not found' });
    }
    
    res.json({
      tide_id: result.rows[0].tide_id,
      message: `TIDE completed with outcome: ${outcome}`
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/tide.learnings
router.post('/tide.learnings', async (req, res, next) => {
  try {
    const { query: searchQuery, limit = 5 } = req.body;
    
    if (!searchQuery) {
      return res.status(400).json({ error: 'Query required' });
    }
    
    // Generate search embedding
    const vector = await generateEmbedding(`query: ${searchQuery}`);
    
    const query = `
      SELECT tide_id, path_id, learnings, outcome,
             1 - (learnings_vector <=> $1::vector) as similarity
      FROM tides
      WHERE learnings_vector IS NOT NULL
        AND learnings_vector <=> $1::vector < 0.7
      ORDER BY learnings_vector <=> $1::vector
      LIMIT $2
    `;
    
    const result = await pool.query(query, [vector, limit]);
    
    res.json({
      results: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    next(error);
  }
});

export default router;