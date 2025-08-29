import { Pool } from 'pg';
import pgvector from 'pgvector/pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://epic_user:epic_pass@localhost:5432/epic_tide',
  max: 20, // connection pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Register pgvector type
pool.on('connect', async (client) => {
  await pgvector.registerType(client);
});