import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import seo from '../src/data/seo.json' with { type: 'json' };
import site from '../src/data/site.json' with { type: 'json' };

const escape = value => value.replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
const origin = new URL(site.url).origin;
if (process.env.SITE_URL && new URL(process.env.SITE_URL).origin !== origin) {
  throw new Error('Change src/data/site.json to set the canonical domain; SITE_URL must match it.');
}
const temporary = resolve('.seo-build');
const template = await readFile(resolve('dist/index.html'), 'utf8');
const absolute = path => new URL(path, origin).href;
const serialize = data => JSON.stringify(data).replaceAll('<', '\\u003c');

try {
  // Render the same React components delivered to browsers, never bot-only content.
  await build({ publicDir:false, logLevel:'warn', build:{ ssr:'src/entry-server.tsx', outDir:temporary, emptyOutDir:true, copyPublicDir:false } });
  const { render, services, brand, email } = await import(pathToFileURL(resolve(temporary, 'entry-server.js')).href);
  const organization = `${origin}/#organization`;
  const website = `${origin}/#website`;
  for (const [route, page] of Object.entries(seo)) {
    const canonical = absolute(route);
    const schema = {
      '@context':'https://schema.org',
      '@graph':[
        {
          '@type':'Organization', '@id':organization, name:site.name, url:`${origin}/`,
          description:'Enterprise AI automation agency providing custom AI assistants, workflow integration, and process automation for large enterprises and global organizations.',
          slogan:brand.tagline,
          logo:{ '@type':'ImageObject', url:absolute('/flowtivo-mark.png'), width:1295, height:1214 },
          email,
          contactPoint:{ '@type':'ContactPoint', email, contactType:'sales', url:`${origin}/#contact`, availableLanguage:'English' },
          hasOfferCatalog:{
            '@type':'OfferCatalog', name:'AI automation and consulting services',
            itemListElement:services.map((service,index)=>({
              '@type':'Offer', itemOffered:{
                '@type':'Service', '@id':`${origin}/#service-${index+1}`,
                name:service.title, description:service.build, serviceType:service.title,
                url:`${origin}/#service-${index+1}`, provider:{ '@id':organization },
              },
            })),
          },
        },
        { '@type':'WebSite', '@id':website, url:`${origin}/`, name:site.name, inLanguage:site.language, publisher:{ '@id':organization } },
        { '@type':'WebPage', '@id':`${canonical}#webpage`, url:canonical, name:page.title, description:page.description, inLanguage:site.language, isPartOf:{ '@id':website }, about:{ '@id':organization }, primaryImageOfPage:{ '@type':'ImageObject', url:absolute('/og-image.png'), width:1200, height:630 } },
      ],
    };
    let html = template.replace(/<title>.*?<\/title>/, `<title>${escape(page.title)}</title>`);
    for (const [key, value] of Object.entries({ description:page.description, 'og:title':page.title, 'og:description':page.description, 'twitter:title':page.title, 'twitter:description':page.description })) {
      const attribute = key.startsWith('og:') ? 'property' : 'name';
      html = html.replace(new RegExp(`<meta ${attribute}="${key}" content="[^"]*"\\s*\\/?>`), `<meta ${attribute}="${key}" content="${escape(value)}" />`);
    }
    const robotsTag = page.noindex
      ? '<meta name="robots" content="noindex, follow" />'
      : '<meta name="robots" content="index, follow, max-image-preview:large" />';

    html = html.replace('</head>', [
      `<link rel="canonical" href="${canonical}" />`,
      robotsTag,
      `<meta property="og:url" content="${canonical}" />`,
      `<meta property="og:site_name" content="${site.name}" />`,
      '<meta property="og:locale" content="en_US" />',
      '<meta property="og:image:alt" content="Flowtivo AI — Less Busywork. More Business." />',
      '<meta name="twitter:image:alt" content="Flowtivo AI — Less Busywork. More Business." />',
      `<script type="application/ld+json">${serialize(schema)}</script></head>`,
    ].join('\n'))
      .replaceAll('content="/og-image.png"', `content="${absolute('/og-image.png')}"`)
      .replace('<div id="root"></div>', `<div id="root">${render(route)}</div>`);
    const output = route === '/' ? resolve('dist/index.html') : resolve(`dist${route}/index.html`);
    await mkdir(dirname(output), { recursive:true });
    await writeFile(output, html);
  }
  const notFound = template.replace(/<title>.*?<\/title>/, '<title>Page Not Found | Flowtivo AI</title>')
    .replace('</head>', '<meta name="robots" content="noindex, follow" /></head>')
    .replace('<div id="root"></div>', `<div id="root">${render('/404')}</div>`);
  await writeFile(resolve('dist/404.html'), notFound);
  await writeFile(resolve('dist/robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${origin}/sitemap.xml\n`);

  const indexableRoutes = Object.entries(seo).filter(([, p]) => !p.noindex).map(([r]) => r);
  const urls = indexableRoutes.map(route => `  <url><loc>${escape(absolute(route))}</loc></url>`).join('\n');
  await writeFile(resolve('dist/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  console.log(`Pre-rendered ${Object.keys(seo).length} canonical page(s), structured data, sitemap, robots.txt and 404.`);
} finally {
  await rm(temporary, { recursive:true, force:true });
}
