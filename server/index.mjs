import { createApp } from './app.mjs';

const dev = process.argv.includes('--dev');
const port = Number(process.env.PORT || (dev ? 5173 : 3000));
const host = process.env.HOST || '127.0.0.1';

try {
  const app = await createApp({ dev, dbPath: process.env.SQLITE_PATH || './data/flowtivo.sqlite' });
  if (!app.delivery.ready) console.warn('Email setup needed: add SMTP_USER and SMTP_PASS to .env. Contact submissions are disabled until mail is configured.');
  app.server.on('error', error => {
    console.error(`Server could not start: ${error.message}`);
    process.exitCode = 1;
    app.close().catch(() => {});
  });
  app.server.listen(port, host, () => {
    console.log(`Flowtivo AI ${dev ? 'development' : 'production'} server: http://${host}:${port}`);
  });
  let closing = false;
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, async () => {
      if (closing) return;
      closing = true;
      await app.close();
      process.exit(0);
    });
  }
} catch (error) {
  console.error(`Could not start Flowtivo AI: ${error.message}`);
  if (!dev) console.error('Run npm run build before npm start.');
  process.exitCode = 1;
}
