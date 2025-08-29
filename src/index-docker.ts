import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

import app from './app';
import { pool } from './config/database';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected');
    
    // Skip embedding model initialization for Docker
    console.log('⏭️  Skipping embedding model (will load on first API call)');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log('📝 POST-only API ready for EPIC-TIDE');
      console.log('🐳 Running in Docker container');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();