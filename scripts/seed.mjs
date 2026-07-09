// Standalone seed / reset script.
//   npm run seed          -> seeds demo content if the DB is empty
//   npm run seed -- reset -> wipes all content and re-seeds demo content
import { openDb, DB_PATH } from '../src/lib/seed-data.mjs';
import Database from 'better-sqlite3';
import { existsSync, unlinkSync } from 'node:fs';

const reset = process.argv.includes('reset');

if (reset && existsSync(DB_PATH)) {
  console.log('Resetting database…');
  unlinkSync(DB_PATH);
  if (existsSync(DB_PATH + '-wal')) unlinkSync(DB_PATH + '-wal');
  if (existsSync(DB_PATH + '-shm')) unlinkSync(DB_PATH + '-shm');
}

const db = reset ? openDb() : openDb();
const count = db.prepare('SELECT COUNT(*) AS n FROM site').get().n;
console.log(
  count > 0
    ? `Database already seeded at ${DB_PATH}.`
    : `Seeded demo content at ${DB_PATH}.`
);
db.close();
