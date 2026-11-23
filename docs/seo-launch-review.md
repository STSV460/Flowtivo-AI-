# Flowtivo AI: pre-launch SEO review

Date: 9 November 2026. Canonical origin: https://flowtivoai.website/.

Applied the requested [claude-seo](https://github.com/AgriciDaniel/claude-seo) technical, content, schema, sitemap and image guidance from revision `6be93f45064ffbadced572b5d5c95f55fd263af0`. The skill's isolated Python/Chromium runtime is not configured; no bundled crawl, Lighthouse score, Google API report or keyword-volume data is claimed. Checks below use source inspection, the production build, integration tests and computer-use browser verification.

## Findings and changes

| Priority | Before | Implemented | Verification |
| --- | --- | --- | --- |
| Critical | Initial HTML had an empty React root. Services and answers required JavaScript. | Build-time rendering of the same React homepage; hydration preserves interactions. | Raw HTML contains the hero, eight services, three systems, FAQ answers and contact form. No initial opacity hiding. |
| High | No canonical unless an environment variable was set; client canonical followed the current host. | One configured production origin used by the build and client. Query strings and section fragments do not change the canonical. | Metadata test plus hydrated browser canonical check. |
| High | No robots.txt or XML sitemap. | Build-generated crawl rules and a sitemap containing only the canonical homepage. | Sitemap/robots tests. Do not index section fragments or legacy redirect URLs separately. |
| High | No business structured data. | Organization, WebSite, WebPage and eight real Service entries connected through the offer catalog. | JSON parsing, provider references and matching visible service anchors tested. |
| Medium | Page title used only the brand slogan; agency category was unclear. | Title: “AI Automation Agency & Consulting \| Flowtivo AI”; descriptive summary, agency identification, service heading and two helpful agency FAQs. | Content matches actual services and audience. No meta-keyword stuffing or hidden keyword blocks. |
| Medium | FAQ answers were mounted only when opened. | Native disclosure elements retain answers in initial HTML and support keyboard use. | Raw HTML test plus browser open/close verification. |
| Medium | Font CSS imported unrelated writing-system subsets; FAQ required extra client code. | Latin font subsets and native FAQ controls. Booking remains lazy-loaded. | Main JS changed from about 500.48 KB to 443.73 KB after dependency patches; this is a build-size comparison, not a speed or ranking score. |
| Medium | Social image URLs were relative. | Absolute Open Graph/Twitter image, page URL, site name and descriptive image labels. | Metadata and asset-existence checks. |
| Medium | Static hosting lacked a prepared error document. | Pre-rendered 404.html with noindex and a return-home link. | Error-page test. Host must serve it with HTTP 404, not a catch-all 200 rewrite. |

Original artwork remains unchanged. Logo images have explicit dimensions; the hero mark stays visible above the fold. No fake reviews, ratings, project totals, addresses, staff, client results or partnership claims were added. The measured engineering section remains explicitly scoped to a dated local benchmark.

The owner supplied the public business email `automation@flowtivoai.website`. It now appears consistently in visible contact links, Organization schema and server fallback messages. The owner also selected this address as the sole enquiry-notification recipient. The existing authenticated Gmail SMTP sender remains separate; neither inbox delivery nor domain-provider forwarding has been verified for this new destination.

## Search intents

These are editorial targets based on the owner's actual services, not measured search-volume or ranking data.

| Intent | Target phrases | Existing destination |
| --- | --- | --- |
| Brand | Flowtivo AI, Flowtivo AI automation | Homepage, brand identity and Organization schema |
| Agency selection | AI automation agency, AI automation companies, AI automation services | Hero, services and comparison FAQ |
| Implementation | business workflow automation, SOP automation, department automation | Services 4 and 6; operations flagship system |
| Knowledge | custom internal AI assistants, RAG knowledge assistant | Service 3; knowledge flagship system |
| Advisory | AI consulting, AI strategy, AI readiness audit | Services 1 and 2; process section |

“Automation agencies” alone is broad and may mean industrial automation. The page qualifies its offering as AI and business workflow automation. The single-page structure remains intact as requested. Separate service pages could be considered later only with useful original material and owner approval; do not create duplicate doorway pages.

## Launch dependencies and remaining evidence

1. Vercel source configuration and serverless backend compatibility are prepared and locally tested. Complete an authenticated deployment, domain DNS and HTTPS after the owner lifts the deployment hold. Verify public `/`, `/robots.txt`, `/sitemap.xml`, assets, redirects and actual 404 responses. Sitemap MIME type must be application/xml or text/xml. These public checks cannot be completed against a localhost-only build.
2. Verify ownership in Google Search Console after the domain is connected. Add only the exact TXT record supplied by Google. Submit `https://flowtivoai.website/sitemap.xml`, inspect the homepage and request indexing. Do not claim submission until Google confirms it.
3. Inspect the live page with Google's Rich Results Test/Schema validator. Organization/service markup helps describe the business; it does not promise a special result. No new FAQPage or fabricated rating markup was added.
4. Measure the deployed site with PageSpeed Insights. Track field LCP, INP and CLS when real-user data is available. No performance score or CWV pass has been invented from local build size.
5. In Search Console, review discovery/indexing first, then impressions and clicks by brand and service query. If canonical selection differs, inspect redirects and rendered metadata. If indexed but receiving no relevant impressions, review intent and evidence before expanding content.
6. Add genuine case studies only after results, methodology and publication consent exist. Publish verified professional profiles and earn relevant editorial links; avoid bought links, fake trust badges or fabricated testimonials.

Google decides indexing, snippets and ranking. Neither this skill nor code changes can guarantee first place or immediate inclusion. Supporting primary sources: [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [choosing an SEO](https://developers.google.com/search/docs/fundamentals/do-i-need-seo).

## Repeatable checks

```sh
npm run build
npm test
npm run seo:check
```

The final pre-launch run passed 24 checks: eleven standalone backend/integration checks, six SEO checks and seven Vercel contact/security checks. Browser verification covered hydration errors, metadata, FAQ expansion, mobile overflow and loading/dismissing the real Fillout popup. No appointment was booked.
