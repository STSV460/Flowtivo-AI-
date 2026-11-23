import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat, access } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { openDatabase } from './database.mjs';
import { createMailQueue } from './mail.mjs';
import { createContactHandler, json } from './contact.mjs';
import seo from '../src/data/seo.json' with { type: 'json' };
import navigation from '../src/data/navigation.json' with { type: 'json' };

const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

export async function createApp({ dev = false, dbPath = './data/flowtivo.sqlite', distDir = './dist', mail } = {}) {
  const root = resolve(distDir);
  if (!dev) await access(resolve(root, 'index.html'));
  const database = openDatabase(dbPath);
  const delivery = createMailQueue(database, mail);
  const contact = createContactHandler(database, delivery);
  let vite;

  async function serveStatic(request, response, path) {
    if (!['GET', 'HEAD'].includes(request.method)) {
      return json(response, 405, { error: 'Method not allowed.' }, { Allow: 'GET, HEAD' });
    }
    const route = path === '/' ? '/' : path.replace(/\/+$/, '');
    const isPage = Object.hasOwn(seo, route);
    let file = isPage ? resolve(root, `.${route}`, 'index.html') : resolve(root, `.${path}`);
    let status = 200;
    if (!file.startsWith(root + sep) || path.split('/').some(segment => segment.startsWith('.'))) {
      return json(response, 404, { error: 'Not found.' });
    }
    try {
      const entry = await stat(file);
      if (!entry.isFile()) throw new Error('Not a file');
    } catch {
      if (extname(path)) return json(response, 404, { error: 'Not found.' });
      file = resolve(root, '404.html');
      status = 404;
    }
    response.writeHead(status, {
      'Content-Type': types[extname(file)] || 'application/octet-stream',
      'Cache-Control': path.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache',
      ...(status === 404 ? { 'X-Robots-Tag': 'noindex' } : {}),
    });
    if (request.method === 'HEAD') return response.end();
    createReadStream(file).on('error', () => response.destroy()).pipe(response);
  }

  const server = createServer(async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    try {
      const url = new URL(request.url, 'http://localhost');
      const path = decodeURIComponent(url.pathname);
      const route = path === '/' ? '/' : path.replace(/\/+$/, '');
      const section = navigation.aliases[route];
      if (section && ['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(301, { Location: `/${url.search}#${section}` });
        return response.end();
      }
      if (path === '/api/contact') return await contact(request, response);
      if (path.startsWith('/api/')) return json(response, 404, { error: 'Not found.' });
      if (vite) return vite.middlewares(request, response, () => json(response, 404, { error: 'Not found.' }));
      return await serveStatic(request, response, path);
    } catch {
      if (!response.headersSent) json(response, 400, { error: 'Could not process this request.' });
      else response.destroy();
    }
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;

  if (dev) {
    const { createServer: createViteServer } = await import('vite');
    vite = await createViteServer({
      server: { middlewareMode: true, hmr: { server } },
      appType: 'spa',
    });
  }

  async function close() {
    await vite?.close();
    if (server.listening) await new Promise((resolveClose, reject) => server.close(error => error ? reject(error) : resolveClose()));
    await delivery.close();
    database.close();
  }
  return { server, close, delivery };
}
