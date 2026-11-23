# Netlify launch preparation

Updated 10 November 2026. The owner authorized launch, then selected another hosting provider instead of upgrading Vercel. Netlify was selected because its free hosting supports commercial projects, custom domains and Node.js functions. Existing team `stsv460` was verified on its legacy Free plan; no paid upgrade or automatic recharge was enabled.

## Prepared and verified

- `netlify.toml` builds the existing site and publishes only `dist`. Legacy page URLs redirect to matching homepage sections; no catch-all 200 rewrite exists.
- `netlify/functions/contact.mjs` handles `/api/contact` using the existing validated serverless mail pipeline. The adapter replaces the forwarding header with Netlify's trusted `context.ip`, so visitors cannot select their rate-limit identity through that header.
- The sole notification recipient is `automation@flowtivoai.website`. The authenticated Gmail SMTP sender stays server-only. SMTP acceptance is required before success; no persistent database or background retry queue is claimed for Netlify.
- Production build and all **26 application tests** passed, including two adapter tests with disposable loopback SMTP, recipient checks, delivery failure and forged-header rate-limit attempts. The six SEO checks are included in this total.
- Netlify CLI 27.16.3 bundled the function for Node.js 24. The package contains no private environment file, SQLite database or actual SMTP password. Generated `.netlify` files are excluded from Git and other deployment contexts.
- The offline Netlify emulator returned homepage 200, robots 200, sitemap 200 with XML MIME type, services 301 to `/#services`, unknown/private/source paths 404, contact GET 405 and invalid contact POST 400. No valid enquiry or external email was submitted through the emulator.
- A separately authorized real SMTP test on 9 November reached the business address and appeared in its existing forwarded Gmail inbox. No direct Gmail CC/BCC was added. This proves that test delivery path, not future Netlify function delivery.

The Strix report predates the Netlify adapter. Its conclusions remain scoped to that earlier snapshot; no new complete Strix scan or production security certification is claimed for Netlify.

## Launch status

1. Netlify CLI authorized and a separate `flowtivo-ai` project created. Required SMTP settings were added as masked server-side secrets with the owner's explicit approval.
2. Draft and production deployments completed. A production contact test returned HTTP 201 and arrived in the business address's forwarded inbox. HTTPS, sitemap, robots, redirects, real 404s and private-file blocking passed. Desktop and mobile layouts were checked against the hosted draft.
3. The domain and www alias were attached. Spaceship nameservers, email-forwarding MX and SPF records remained intact. Netlify issued a certificate for both names; www redirects to the apex. Some local DNS caches may temporarily retain an earlier negative result.
4. Google Search Console domain ownership was verified for `pvshariharan324@gmail.com`. The canonical sitemap was submitted, and Google accepted a homepage indexing request. Google's live URL tests reported both homepage and sitemap available. The sitemap report still showed **“Couldn't fetch”** immediately after submission and one resubmission; monitor it for Google's later processing. Submission is not proof of successful sitemap processing or indexing. Google controls indexing and ranking; first place is not guaranteed.
5. The per-instance form limiter is not a global quota. Production edge abuse protection and stalled-stream deadline enforcement have not been independently established.

## Historical public DNS

On 9 November, apex and `www` had no A, AAAA or CNAME. Nameservers were `launch1.spaceship.net` and `launch2.spaceship.net`. Existing mail records:

```text
MX  0 mx1.efwd.spaceship.net.
MX  0 mx2.efwd.spaceship.net.
TXT "v=spf1 include:spf.efwd.spaceship.net ~all"
```

Re-read records immediately before DNS changes; this snapshot is not permission to overwrite later edits.

## References

- [Netlify pricing](https://www.netlify.com/pricing/)
- [Free plan commercial-use guidance](https://www.netlify.com/blog/introducing-netlify-free-plan/)
- [Functions API and trusted context IP](https://docs.netlify.com/build/functions/api/)
- [Functions configuration and Node.js runtime](https://docs.netlify.com/build/functions/configuration/)
- [External DNS setup](https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/)
