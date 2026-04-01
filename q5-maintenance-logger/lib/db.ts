import { createClient, type Client } from '@libsql/client';
import path from 'path';
import fs from 'fs';

export function getDb(): Client {
  if (process.env.TURSO_DATABASE_URL) {
    return createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }

  // Local dev: file-based SQLite via libsql
  const dbDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  const dbPath = path.join(dbDir, 'db.sqlite');
  return createClient({ url: `file:${dbPath}` });
}

export async function ensureSchema(db: Client): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS issues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_number TEXT NOT NULL UNIQUE,
      property_name TEXT NOT NULL,
      category TEXT NOT NULL,
      urgency TEXT NOT NULL,
      description TEXT NOT NULL,
      photo_name TEXT,
      status TEXT NOT NULL DEFAULT 'Open',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
}
