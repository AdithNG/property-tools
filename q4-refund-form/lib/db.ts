import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  const DB_PATH = process.env.NODE_ENV === 'production'
    ? '/tmp/db.sqlite'
    : path.join(process.cwd(), 'data', 'db.sqlite');

  if (process.env.NODE_ENV !== 'production') {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  _db = new Database(DB_PATH);

  _db.exec(`
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
    );
  `);

  return _db;
}
