/**
 * Database client — Neon Serverless Postgres
 * 
 * Uses HTTP queries for optimal serverless performance.
 * Returns null pool if DATABASE_URL is not configured.
 */

import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

let sql: NeonQueryFunction<false, false> | null = null;

export function getDb(): NeonQueryFunction<false, false> | null {
  if (sql) return sql;

  const url = process.env.DATABASE_URL;
  if (!url) return null;

  sql = neon(url);
  return sql;
}

/**
 * Check if the database is configured and reachable.
 */
export function isDbConfigured(): boolean {
  return !!process.env.DATABASE_URL;
}
