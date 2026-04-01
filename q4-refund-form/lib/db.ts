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
    CREATE TABLE IF NOT EXISTS refund_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      booking_reference TEXT NOT NULL,
      booking_date TEXT NOT NULL,
      refund_reason TEXT NOT NULL,
      additional_details TEXT,
      file_name TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
}
