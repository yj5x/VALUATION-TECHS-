import { Pool } from 'pg';
import { logger } from '../utils/logger';

let pool: Pool;

export const connectDB = async (): Promise<Pool> => {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Test the connection
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();

    logger.info('Database connected successfully');
    return pool;
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

export const getDB = (): Pool => {
  if (!pool) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return pool;
};

export const closeDB = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    logger.info('Database connection closed');
  }
};

