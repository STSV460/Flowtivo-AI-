import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import seo from '../src/data/seo.json' with { type:'json' };
import site from '../src/data/site.json' with { type:'json' };

const html = await readFile(resolve('dist/index.html'), 'utf8');
const root = html.slice(html.indexOf('<div id="root">'));
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);

test('production HTML contains complete service content before JavaScript runs', () => {
  assert.equal((root.match(/<h1\b/g) || []).length, 1);
  for (const text of ['AI automation services for your business.', 'Custom Internal AI Assistants', 'AI Operations &amp; Workflow Automation Hub', 'What does an AI automation agency do?', 'An AI automation agency maps repetitive business processes', 'Send us a message.']) assert.ok(root.includes(text), text);
  assert.ok(!root.includes('opacity:0'), 'Pre-rendered content must be visible without scripts');
  assert.ok(Buffer.byteLength(html) < 2_000_000, 'Keep critical content in bounded initial HTML');
});

test('metadata uses one production canonical and absolute social images', () => {
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.ok(html.includes(`href="${site.url}/"`));
  assert.ok(html.includes('content="index, follow, max-image-preview:large"'));
  assert.ok(html.includes(`<meta property="og:url" content="${site.url}/"`));
  assert.ok(html.includes(`content="${site.url}/og-image.png"`));
  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.ok(seo['/'].title.includes('AI Automation Agency'));
  assert.ok(!/localhost|127\.0\.0\.1|your-domain\.example/.test(html));
});

test('business schema describes visible real services without fabricated trust signals', () => {
  assert.equal(schema['@context'], 'https://schema.org');
  const organization = schema['@graph'].find(node => node['@type'] === 'Organization');
  assert.equal(organization.name, site.name);
  assert.equal(organization.url, `${site.url}/`);
  assert.equal(organization.email, site.email);
  assert.ok(root.includes(`href="mailto:${site.email}"`));
  assert.ok(!root.includes('pvshariharan324@gmail.com'));
  assert.equal(organization.hasOfferCatalog.itemListElement.length, 8);
  for (const offer of organization.hasOfferCatalog.itemListElement) {
    const service = offer.itemOffered;
    assert.equal(service.provider['@id'], organization['@id']);
    assert.ok(root.includes(`id="${new URL(service.url).hash.slice(1)}"`));
  }
  assert.ok(!/AggregateRating|reviewCount|foundingDate|streetAddress/.test(JSON.stringify(schema)));
  assert.deepEqual(schema['@graph'].map(node => node['@type']), ['Organization', 'WebSite', 'WebPage']);
});

test('sitemap lists only canonical pages and robots advertises its actual location', async () => {
  const xml = await readFile(resolve('dist/sitemap.xml'), 'utf8');
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  const indexable = Object.entries(seo).filter(([, p]) => !p.noindex).map(([path]) => new URL(path, site.url).href);
  assert.deepEqual(urls, indexable);
  assert.ok(!/lastmod|priority|changefreq|#|\?/.test(xml.replace(/<\?xml[^>]*>/, '')));
  const robots = await readFile(resolve('dist/robots.txt'), 'utf8');
  assert.ok(robots.includes(`Sitemap: ${site.url}/sitemap.xml`));
  assert.ok(robots.includes('Allow: /\n'));
  assert.ok(!robots.includes('Disallow: /\n'));
});

test('internal fragment links resolve to content, including department enquiries', () => {
  const ids = new Set([...root.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  for (const [, href] of root.matchAll(/\bhref="([^"]+)"/g)) {
    if (!href.startsWith('#') && !href.startsWith('/#') && !href.startsWith('/?')) continue;
    const url = new URL(href.replaceAll('&amp;', '&'), site.url);
    if (url.hash) assert.ok(ids.has(decodeURIComponent(url.hash.slice(1))), href);
  }
});

test('social image and structured-data logo exist; 404 stays out of search', async () => {
  await access(resolve('dist/og-image.png'));
  await access(resolve('dist/flowtivo-mark.png'));
  const missing = await readFile(resolve('dist/404.html'), 'utf8');
  assert.ok(missing.includes('content="noindex, follow"'));
  assert.ok(missing.includes('This workflow leads somewhere else.'));
  assert.ok(!missing.includes('rel="canonical"'));
});
