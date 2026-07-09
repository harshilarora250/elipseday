import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DB_PATH, initSchema } from './seed-data.mjs';

// Reuse a single connection across hot-reloads in dev.
const globalForDb = globalThis as unknown as { __portfolioDb?: Database.Database };

function createDb(): Database.Database {
  mkdirSync(dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  initSchema(db);
  return db;
}

export const db: Database.Database = globalForDb.__portfolioDb ?? createDb();
if (process.env.NODE_ENV !== 'production') {
  globalForDb.__portfolioDb = db;
}
