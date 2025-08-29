import { Router, Request, Response } from 'express';
import { 
  generateMultiTierEmbedding, 
  generateMultiTierBatch,
  checkMultiTierHealth,
  compareTexts
} from '../../services/multi-tier-embeddings';
import { apiKeyAuth } from '../../middleware/auth';

const router = Router();

router.post('/v2/embed', apiKeyAuth, async (req: Request, res: Response) => {
  try {
    const { text, prefix } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const embedding = await generateMultiTierEmbedding(text, prefix);
    
    res.json({
      success: true,
      data: embedding,
      tiers: {
        e5: {
          dimension: embedding.e5_dimension,
          model: 'intfloat/multilingual-e5-large'
        },
        ada002: {
          dimension: embedding.ada002_dimension,
          model: 'text-embedding-ada-002'
        }
      }
    });
  } catch (error: any) {
    console.error('Multi-tier embedding error:', error);
    res.status(500).json({ 
      error: 'Failed to generate multi-tier embeddings',
      details: error.message 
    });
  }
});

router.post('/v2/embed/batch', apiKeyAuth, async (req: Request, res: Response) => {
  try {
    const { texts, prefix } = req.body;
    
    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({ error: 'Texts array is required' });
    }

    if (texts.length > 100) {
      return res.status(400).json({ error: 'Maximum 100 texts per batch' });
    }

    const result = await generateMultiTierBatch(texts, prefix);
    
    res.json({
      success: true,
      data: result,
      tiers: {
        e5: {
          dimension: 1024,
          model: 'intfloat/multilingual-e5-large'
        },
        ada002: {
          dimension: 1536,
          model: 'text-embedding-ada-002',
          tokens_used: result.ada002_tokens
        }
      }
    });
  } catch (error: any) {
    console.error('Batch multi-tier embedding error:', error);
    res.status(500).json({ 
      error: 'Failed to generate batch multi-tier embeddings',
      details: error.message 
    });
  }
});

router.post('/v2/embed/compare', apiKeyAuth, async (req: Request, res: Response) => {
  try {
    const { text1, text2, tier = 'both' } = req.body;
    
    if (!text1 || !text2) {
      return res.status(400).json({ error: 'Both text1 and text2 are required' });
    }

    const result = await compareTexts(text1, text2, tier);
    
    res.json({
      success: true,
      data: {
        ...result,
        text1_preview: text1.substring(0, 100),
        text2_preview: text2.substring(0, 100),
        tier_used: tier
      }
    });
  } catch (error: any) {
    console.error('Text comparison error:', error);
    res.status(500).json({ 
      error: 'Failed to compare texts',
      details: error.message 
    });
  }
});

router.get('/v2/health', async (req: Request, res: Response) => {
  try {
    const health = await checkMultiTierHealth();
    
    const status = health.fully_operational ? 200 : 503;
    
    res.status(status).json({
      success: health.fully_operational,
      services: {
        e5: {
          status: health.e5 ? 'healthy' : 'unhealthy',
          model: 'intfloat/multilingual-e5-large',
          dimension: 1024
        },
        ada002: {
          status: health.ada002 ? 'healthy' : 'unhealthy', 
          model: 'text-embedding-ada-002',
          dimension: 1536
        }
      },
      fully_operational: health.fully_operational
    });
  } catch (error: any) {
    console.error('Health check error:', error);
    res.status(503).json({
      success: false,
      error: 'Health check failed',
      details: error.message
    });
  }
});

export default router;