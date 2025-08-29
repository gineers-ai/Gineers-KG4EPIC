import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

import app from './app';
import { pool } from './config/database';
import { checkEmbeddingServiceHealth } from './services/embedding';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected');
    
    // Check embeddings service
    console.log('🔍 Checking embeddings service...');
    const embeddingsReady = await checkEmbeddingServiceHealth();
    if (embeddingsReady) {
      console.log('✅ Embeddings service connected');
    } else {
      console.log('⚠️ Embeddings service not available - will retry on requests');
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log('🔒 POST-only API ready for EPIC-TIDE');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();