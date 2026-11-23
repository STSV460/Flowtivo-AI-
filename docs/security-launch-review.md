# Flowtivo AI: pre-deployment security review

Reviewed 9 November 2026. Deployment and domain/DNS changes remain on hold at the owner's explicit request.

## Result

The requested [Strix](https://github.com/usestrix/strix) review completed against an 81-file sanitized source snapshot. No exploitable vulnerability was demonstrated in the tested scope. This is bounded source and localhost evidence, not a security certification or a production availability guarantee.

- Final run: `source-complete_614a`, completed 07:16 UTC, Strix Agent 1.7.0.
- Complete snapshot: actual public `src/data` included; credentials, private enquiry data, Git history and installed dependencies excluded.
- Independent baseline: Node 24.18.0, `npm ci`, production build, 24/24 application tests and a separate execution of the six SEO checks passed. Those six are already part of the 24, not six additional distinct checks.
- Additional scanner-generated security suite passed 12/12 and independently replayed 12/12 inside the disposable sandbox. Its detailed outcomes are recorded in the report and coverage export; this suite is not added to the repository's `npm test` count.
- Final coverage: 17 surfaces reviewed, zero findings filed, two production-related follow-up gaps. The report describes both positive controls and untested assumptions.
- Current lockfile advisory check: zero known npm vulnerabilities.

Full findings and limitations: [Strix report](./strix-security-report.md). Compact formal evidence: [coverage export](./strix-security-coverage.json). Raw model transcripts and credentials are not included.

## Changes before the final Strix snapshot

The initial npm audit reported four advisories: three high and one low. Updated Vite to 8.3.6, Zod to 4.6.7, esbuild to 0.28.2 and source-map-js to 1.2.2. The patched lockfile passed the public npm advisory check. Development/build advisories are not represented as demonstrated exploits against the production website.

The prepared Vercel handler validates request origin, content type, fields, consent and honeypot; caps streamed JSON at 16,000 bytes; limits bursts per instance; escapes visitor email HTML; fixes the notification recipient; disables file/URL attachments; and acknowledges success only after SMTP accepts that recipient. Failures retain the visitor's input for retry. Its per-instance limiter is not a global quota. Vercel mode deliberately has no persistent SQLite disk or background retry queue.

The standalone server retains prepared SQLite writes, transactional enquiry/job creation and bounded mail retries. Private files remain outside the public build. Unknown pages return a real 404 with noindex.

## Changes after the scan snapshot

The owner subsequently supplied `automation@flowtivoai.website` and selected **business email only** for enquiry notifications. Public links, fallback messages and Organization schema now share `src/data/site.json`; both mail handlers use that address as the sole recipient. The existing authenticated Gmail SMTP sender remains unchanged. Docker runtime packaging now includes the shared site configuration. This configuration change was regression-tested against the current source with the production build and all 24 application tests, including disposable SMTP recipient assertions; it was not represented as part of the earlier Strix snapshot.

No external test email was sent during this review. The new business address's inbox placement and any provider forwarding remain unverified. The separate Fillout popup sends submissions to Fillout; its notification routing is controlled in the Fillout account and is not changed by this website mail configuration.

## Limits and launch follow-up

1. After deployment is authorized, verify Vercel's actual forwarding-header rewriting, stalled-stream execution limits, edge abuse protection, response headers and 404/redirect behavior. The handler currently has no separate body-read timer; local tests do not prove the platform's configured duration enforcement.
2. Verify provider TLS/authentication and delivery to the new business inbox through an explicitly controlled delivery check. SMTP acceptance does not prove inbox placement.
3. Distributed abuse, cross-instance quotas, third-party internals and container runtime execution were not validated. Docker source packaging was checked, but no full container build/run is claimed.
4. The offline Trivy vulnerability database was unavailable; dependency advisory results came from the successful npm audit. Git history and private credentials were deliberately outside scanner scope.
5. Strix's underlying scanners made two automatic update checks to Semgrep/Trivy endpoints outside the intended npm-only network scope. Captured requests contained tool/environment metadata, not source or contact data. Subsequent scans disabled version checks and used blocked-network proxy settings. The full report discloses this deviation.

## Repeatable repository checks

```sh
npm ci
npm run build
npm test
npm run seo:check
npm audit
git diff --check
```

The integration tests bind disposable HTTP/SMTP services to `127.0.0.1`; restricted environments must allow those local sockets. They never use the real Gmail account or send external mail.
