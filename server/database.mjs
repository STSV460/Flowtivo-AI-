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
      company_website TEXT NOT NULL DEFAULT '',
      country TEXT NOT NULL DEFAULT '',
      job_title TEXT NOT NULL DEFAULT '',
      existing_tools TEXT NOT NULL DEFAULT '',
      timeline TEXT NOT NULL DEFAULT 'exploring',
      budget TEXT NOT NULL DEFAULT 'undetermined',
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

  try {
    const columns = db.prepare('PRAGMA table_info(inquiries)').all().map(c => c.name);
    if (columns.length > 0) {
      if (!columns.includes('company_website')) db.exec("ALTER TABLE inquiries ADD COLUMN company_website TEXT NOT NULL DEFAULT ''");
      if (!columns.includes('country')) db.exec("ALTER TABLE inquiries ADD COLUMN country TEXT NOT NULL DEFAULT ''");
      if (!columns.includes('job_title')) db.exec("ALTER TABLE inquiries ADD COLUMN job_title TEXT NOT NULL DEFAULT ''");
      if (!columns.includes('existing_tools')) db.exec("ALTER TABLE inquiries ADD COLUMN existing_tools TEXT NOT NULL DEFAULT ''");
      if (!columns.includes('timeline')) db.exec("ALTER TABLE inquiries ADD COLUMN timeline TEXT NOT NULL DEFAULT 'exploring'");
      if (!columns.includes('budget')) db.exec("ALTER TABLE inquiries ADD COLUMN budget TEXT NOT NULL DEFAULT 'undetermined'");
    }
  } catch {
    // Column migration guard
  }

  return db;
}
