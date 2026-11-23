# Security Penetration Test Report

**Generated:** 2026-11-09 07:16:06 UTC

# Executive Summary

**No exploitable security vulnerability was demonstrated in the supplied complete Flowtivo AI snapshot.** The focused pre-deployment review found effective controls across the tested contact-validation, email-injection, rendering and private-file-isolation paths.

The actual supplied `src/data/seo.json` and `src/data/content.ts` were verified present before testing. A complete disposable copy installed and built successfully; all **24 application tests** and **6 separately executed SEO checks** passed. The SEO checks are included in the 24-test suite, not additional distinct tests. The public npm advisory check reported **zero known vulnerabilities**.

An additional **12-test security suite**, independently replayed successfully, exercised the actual contact handler through loopback HTTP and disposable SMTP. No unauthorized recipient, injected email header, executable visitor markup, SQL execution or private-file disclosure was observed. All 81 supplied files remained unchanged; no content fixtures or source patches were introduced.

**Assessment limits:** This is positive evidence for the supplied source and bounded local tests, not a guarantee about deployed Vercel edge enforcement, real SMTP delivery or high-volume distributed abuse. Those production-only behaviors remain unverified.

**Network-scope deviation:** Two automatic scanner update checks contacted non-npm endpoints. They transmitted tool/environment metadata, not source content or contact data. This deviation is disclosed below. Application, browser and SMTP testing remained on `127.0.0.1`; no external email or appointment submissions occurred.

# Methodology

**Approach:** Focused white-box review using relevant OWASP WSTG input-validation, injection, browser-rendering, resource-handling and file-access testing principles. Testing used disposable copies, synthetic records and local SMTP only. Exactly two specialist workstreams were used, with independent replay of the contact security evidence.

**Required baseline commands and observed results**, using Node `v24.18.0` and npm `11.16.0`:

```text
npm ci                         exit 0; 172 packages added; 16 seconds
npm run build                  exit 0; TypeScript, Vite and prerender succeeded
npm test                       exit 0; 24 passed, 0 failed, 0 skipped
npm run seo:check               exit 0; 6 passed, 0 failed
npm audit --json --registry=https://registry.npmjs.org
                               exit 0; 0 known vulnerabilities
```

The complete build generated the canonical page, structured data, sitemap, robots file and 404 page. Installed dependency versions and the lockfile were inspected. Additional testing included 67 invalid field/type/boundary cases, streamed-body limits, actual SMTP message inspection, concurrent submissions, SQLite transactions and queue races, 36 static-file requests, and guarded Chromium rendering/hydration checks. The additional security suite passed **12/12**, then independently passed **12/12** again.

**Source-aware coverage:** Local Semgrep rules scanned 38 JavaScript/TypeScript files, with structural ast-grep targets derived from that scan's file scope. Gitleaks found no secrets in the supplied snapshot. An offline Trivy configuration pass completed; its vulnerability scan could not run because no cached vulnerability database was available. No database was downloaded. Locked-package advisory coverage therefore rests on the successful npm audit, not Trivy. Deliberately omitted history and private credentials were not assessed.

**Network exception:** Default version checks made two outbound GETs to `semgrep.dev/api/check-version` and `check.trivy.dev/updates`. Captured requests contained no body or query; headers included tool versions, automatic identifiers and, for Trivy, platform/command metadata. Subsequent scanner runs used disabled version checks and blocked-network proxy settings. This was outside the npm-only allowance and is not represented as compliant egress. No live application, SaaS, email-provider or booking testing was performed.

# Technical Analysis

**Findings:** Zero confirmed vulnerabilities and zero known npm advisory findings. No vulnerability report or speculative source change was warranted.

**Contact validation and email injection:** Malformed JSON, invalid field types, consent/honeypot violations, invalid email addresses and oversized streamed bodies were rejected before sending. The 16,000-byte boundary and reader cancellation were exercised. SMTP wire evidence confirmed a fixed recipient, a single validated visitor Reply-To, no injected Cc/Bcc headers and escaped visitor HTML. Attacker-selected recipient, envelope, header and attachment properties did not control delivery. These outcomes were independently reproduced.

**Bounded resource handling:** Twelve concurrent requests from the same test client produced five successful SMTP deliveries and seven `429` responses, with a peak of five SMTP sockets. Failed-attempt charging, limiter capacity and expiry were checked. A silent SMTP greeting produced `503` after approximately ten seconds; production transport options rejected a plaintext-only SMTP sink. Brief partial-body requests did not prevent separate healthy homepage/contact requests. These are bounded negative controls, not proof of full-load denial-of-service resistance. The documented per-instance limiter was correctly treated as an intentional secondary guard, not a defective global quota.

**Persistence and races:** Prepared SQLite bindings stored hostile strings literally. A forced queue-write failure rolled back the enquiry. Eight concurrent queue flushes produced one initial send, and six failed attempts reached the configured terminal failure state.

**Rendering and isolation:** Source tracing confirmed developer-controlled content provenance, React rendering and script-safe JSON-LD serialization. Guarded browser checks observed hydration without executing query/hash/path payloads or making external page requests. Static-file testing returned expected public controls while private/source/traversal requests disclosed no protected content. The built output contained no private database, environment file, server source or source map. Deployment configuration was reviewed, but container execution was not performed.

**Chaining:** Contact-to-SMTP, contact-to-SQLite-to-static-access, and URL-to-rendering paths were assessed end to end. No usable security primitive or higher-impact chain was established.

**Open coverage:** Actual Vercel forwarding-header rewriting and stalled-stream deadline enforcement remain unverified. The Web handler has no separate application body-read timer; configured platform duration is not a locally proven guarantee. Real provider TLS/delivery, inbox placement, deployed edge controls, cross-instance quotas, third-party embeds and container runtime behavior were not validated. These limits remain follow-up items rather than clean conclusions or demonstrated findings.

# Recommendations

**Immediate:** No confirmed vulnerability requires an emergency code change. Preserve the supplied source unchanged and retain the successful complete-snapshot baseline and repeatable local security tests as the release evidence.

**Before deployment:** Separately verify that the intended hosting configuration overwrites trusted forwarding headers and enforces effective request/body execution deadlines. Confirm platform-level abuse protection where protection across instances is required; do not treat the application’s documented per-instance limiter as a global quota. These deployment checks were not performed during this source-only review.

**Operational readiness:** Keep SMTP configuration server-only and private state outside public output. Independently establish provider TLS/authentication, timeout behavior and delivery monitoring through the deployment owner's controlled process. Local synthetic SMTP acceptance does not establish inbox delivery.

**Ongoing assurance:** Continue lockfile-based installation and npm advisory checks. Retain the original tests and focused security cases for CRLF/recipient tampering, HTML escaping, byte limits, concurrency, queue atomicity, private-file isolation and hydration. Zero current advisories does not guarantee the absence of unknown vulnerabilities.

**Retest and validation:** Repeat the recorded baseline and local security suite after security-sensitive changes. Retest platform-dependent assumptions when deployment configuration is finalized. For future restricted-network reviews, disable scanner telemetry/update checks and enforce egress restrictions before invoking even version commands.

