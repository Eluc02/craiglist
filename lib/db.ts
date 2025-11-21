import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  pool,
};

export async function getListingById(id: string) {
  const res = await db.query('SELECT * FROM listings WHERE id = $1', [id]);
  return res.rows[0];
}

export async function getRecentListings(limit = 10) {
  const res = await db.query('SELECT * FROM listings ORDER BY created_at DESC LIMIT $1', [limit]);
  return res.rows;
}
