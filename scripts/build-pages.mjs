import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import seo from '../src/data/seo.json' with { type: 'json' };

const escape = value => value.replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
const template = await readFile(resolve('dist/index.html'), 'utf8');
const siteUrl = process.env.SITE_URL?.replace(/\/$/, '');
if (siteUrl && !/^https?:\/\//.test(siteUrl)) throw new Error('SITE_URL must be an absolute http(s) URL.');

for (const [route, page] of Object.entries(seo)) {
  const title = escape(page.title);
  const description = escape(page.description);
  let html = template.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  for (const [key, value] of Object.entries({ description, 'og:title':title, 'og:description':description, 'twitter:title':title, 'twitter:description':description })) {
    const attribute = key.startsWith('og:') ? 'property' : 'name';
    html = html.replace(new RegExp(`<meta ${attribute}="${key}" content="[^"]*"\\s*\\/?>`), `<meta ${attribute}="${key}" content="${value}" />`);
  }
  if (siteUrl) {
    const canonical = escape(siteUrl + route);
    html = html.replace('</head>', `<link rel="canonical" href="${canonical}" /><meta property="og:url" content="${canonical}" /></head>`)
      .replaceAll('content="/og-image.png"', `content="${escape(siteUrl)}/og-image.png"`);
  }
  const output = route === '/' ? resolve('dist/index.html') : resolve(`dist${route}/index.html`);
  await mkdir(dirname(output), { recursive:true });
  await writeFile(output, html);
}
console.log(`Generated ${Object.keys(seo).length} route documents with SEO metadata.`);
