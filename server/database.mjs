import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export function openDatabase(filename) {
  const path = filename === ':memory:' ? filename : resolve(filename);
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(path);
  db.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      company TEXT NOT NULL,
      company_size TEXT NOT NULL,
      department TEXT NOT NULL,
      message TEXT NOT NULL,
      consent INTEGER NOT NULL CHECK (consent = 1),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS email_deliveries (
      inquiry_id INTEGER PRIMARY KEY REFERENCES inquiries(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','sending','sent','failed')),
      attempts INTEGER NOT NULL DEFAULT 0,
      next_attempt_at INTEGER NOT NULL DEFAULT 0,
      last_attempt_at INTEGER NOT NULL DEFAULT 0,
      sent_at TEXT,
      provider_message_id TEXT,
      last_error TEXT
    );
    CREATE INDEX IF NOT EXISTS email_delivery_pending ON email_deliveries(status, next_attempt_at);
  `);
  return db;
}
