import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL connection pool
export const pool = new Pool({
  host: process.env.NODE_ENV === 'production' ? 'postgres' : 'postgres',
  port: 5432,
  database: 'epic_tide',
  user: 'epic_user',
  password: process.env.DB_PASSWORD || 'test123',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
  console.log('Database connected');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
  process.exit(-1);
});