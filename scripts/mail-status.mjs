import { openDatabase } from '../server/database.mjs';
const database = openDatabase(process.env.SQLITE_PATH || './data/flowtivo.sqlite');
try {
  console.table(database.prepare('SELECT status, COUNT(*) AS enquiries FROM email_deliveries GROUP BY status').all());
  const failed = database.prepare("SELECT inquiry_id, attempts, last_error FROM email_deliveries WHERE status = 'failed'").all();
  if (failed.length) console.table(failed);
} finally { database.close(); }
