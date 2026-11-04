# Flowtivo AI

A standalone, single-page marketing website built with **React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion and React Router**. The backend is a regular Node.js HTTP server with a local SQLite database. No platform account or visitor login is required.

## Run locally

Requires Node.js 22.13+; Node.js 24 recommended.

```sh
npm install
npm run dev
```

Open **http://localhost:5173**. This runs Vite with hot reload and the contact API on the same server. SQLite initializes automatically at `data/flowtivo.sqlite`.

## Production build

```sh
npm run build
npm start
```

Open **http://localhost:3000**. `npm start` serves the built frontend and `/api/contact`. SQLite requires no separate database service. Message-form email delivery requires the Gmail SMTP app password configured in private `.env`.

For hosting on a standard Node server or container, set `HOST=0.0.0.0`, the desired `PORT` and a persistent `SQLITE_PATH`. Keep SQLite on durable storage so enquiries survive deployments. This setup targets a single Node server; do not deploy the SQLite file to ephemeral serverless storage.

```sh
HOST=0.0.0.0 PORT=3000 SQLITE_PATH=/persistent-data/flowtivo.sqlite npm start
```

For absolute canonical and social sharing URLs, set your real origin before building:

```sh
SITE_URL=https://your-domain.example npm run build
```

The homepage includes SEO and Open Graph metadata. Navigation scrolls to sections on the same page. Previous page URLs redirect to the matching homepage anchor, e.g. `/services` → `/#services`. `dist/` can also be served by ordinary static hosting, but contact submissions still need the Node backend at `/api/contact`. The full Node server handles both by default.

`.env.example` lists settings. `npm run dev` and `npm start` automatically load private `.env`; credentials remain server-side and are excluded from Git and browser assets.

## Verification

```sh
npm run typecheck
npm run build
npm test
```

Integration tests check homepage delivery, legacy-to-section redirects, SEO, assets, validation, cross-origin rejection, real SQLite persistence and private-file isolation. They use a temporary database and remove it after testing.

## Edit content

- `src/data/content.ts`: brand, services, solutions, departments, FAQ and contact email.
- `src/data/metrics.ts`: measured website-backend metrics derived from the reproducible benchmark report.
- `src/data/projects.ts`: unpublished design concepts without quantified outcomes; not rendered.
- `src/data/team.ts`: profiles for future approved team content; not rendered.
- `src/data/testimonials.ts`: archived illustrative quotes; not rendered.
- `src/data/seo.json`: homepage title and description.
- `src/data/navigation.json`: section navigation and legacy URL redirects.
- `src/styles.css`: visual styling and responsive breakpoints.

The supplied original remains unchanged in `public/flowtivo-logo.png`. The website uses `public/flowtivo-logo-dark.png`: background removed with genuine alpha transparency, original cyan/purple artwork preserved, and lettering changed to white with user approval. There is no added logo background, border or pill. A black-letter transparent variant is saved as `public/flowtivo-logo-transparent-v2.png`. `scripts/prepare-logo.py` reproduces these pixel-level edits from the original using Pillow and NumPy; Python is not required to run the website.

Engineering metrics display measured website-backend results, their local-test scope and a downloadable evidence report. No project-volume, automation-percentage, uptime or customer-savings counters are displayed. Sample case studies, placeholder team profiles and illustrative testimonials are not displayed on the public page. Booking buttons open the configured Fillout demo form in a medium popup. It closes only after a successful Fillout submission or manual dismissal. The separate message form saves enquiries to SQLite and queues an email notification.

## Contact backend

`POST /api/contact` validates required fields, email, phone, employee-count choices and consent; it also rejects a filled honeypot, oversized requests and cross-origin submissions. Success is shown only after SQLite saves the enquiry. There is no public endpoint to read enquiries.

Enquiries are stored in the `inquiries` table of `data/flowtivo.sqlite`, which can be opened with a SQLite database client. The database is excluded from Git and web assets. Demo requests go directly to the configured Fillout form. The separate message form saves to SQLite and emails the submitted details to `pvshariharan324@gmail.com`.

## Assets

Original canvas constellation and CSS diagrams; no invented client logos or portraits. Plus Jakarta Sans is bundled locally via Fontsource (SIL OFL). Lucide and shadcn/Radix components retain their package licenses. Tool names indicate integration options, not partnerships.

## Navigation and reference

The layout uses one continuous homepage, informed by the section hierarchy and layout patterns of [Atomise AI](https://atomiseai.com/). Flowtivo uses its own service descriptions, solution content and benchmark evidence; none were imported from the reference.

Split hero → Metrics → Tools → numbered Services → Process → Flagship Pipelines → Work With Us → About → FAQ → Contact. Service details expand in place; the three original flagship solutions appear as detailed workflow rows. The About section includes department enquiry links. The hero button reads “Explore our Services” and scrolls to `#services`. The floating booking button has been removed.

## Demo booking popup

`src/data/booking.ts` configures form ID `5Zfg3sMa5tus`. All `CallButton` instances open one accessible, shared dialog. The official [Fillout React embed](https://www.npmjs.com/package/@fillout/react) uses `dynamicResize`, `inheritParameters` and the verified `onSubmit` event to close after successful submission. Close button, backdrop dismissal, keyboard focus handling and a direct-form fallback are included. The embed is loaded only after a booking CTA is clicked. No API key or inline global embed script is needed.

## Gmail enquiry notifications

New message-form submissions are saved with a durable email job, then sent to **pvshariharan324@gmail.com**. Notifications include name, work email, optional phone, company, employee count, department, message, consent and receipt time. Reply-To is the visitor’s validated work email, so replying in Gmail reaches the sender.

Configure these server-only values in private `.env`:

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=pvshariharan324@gmail.com
SMTP_PASS=YOUR_GOOGLE_APP_PASSWORD
MAIL_FROM=pvshariharan324@gmail.com
```

Use a Google app password with 2-Step Verification, not the normal account password. Create/manage it at https://myaccount.google.com/apppasswords. Never paste it in chat, prefix it with `VITE_`, or commit `.env`. Restart the server after changing credentials.

```sh
npm run mail:check   # verifies connection and authentication; sends no email
npm run mail:test    # sends a clearly labeled test notification to the fixed recipient
npm run mail:status  # displays queue counts and failed-job references; no contact data
```

Transient errors keep the enquiry and retry with exponential backoff. After six failed attempts, the delivery is marked `failed` for operator review. Temporary delivery errors never erase the saved enquiry. The success message confirms durable acceptance; SMTP acceptance does not guarantee inbox placement. Credentials are required before the contact API accepts new enquiries. Previous records are not automatically emailed retroactively.

The automated tests use a disposable local SMTP server to check the full API → SQLite → SMTP flow, recipient, all fields, Reply-To, retries, and missing-configuration behavior. They never use the real Gmail credentials or send external mail.

The November 2026 layout revision is documented in `design/reference-notes.md`. Flowtivo retains its own services, brand artwork, palette, copy, four delivery stages and three flagship systems. No reference-company results, services, profiles, robot assets or prices are used.

The toolkit lists n8n, Supabase, Retell AI, Bolna AI, Airtable, GitHub, GitLab and Google Workspace, as requested by the owner. `src/data/tools.ts` controls labels and categories. Tool SVG provenance is in `public/tools/README.md`. Contact is directly available in the header navigation.

## Reproduce the engineering benchmark

```sh
npm run benchmark:contact
```

The script sends 100 sequential synthetic enquiries to an isolated loopback HTTP server with a temporary SQLite database and disposable SMTP receiver. It does not load `.env`, use real credentials, contact Gmail or write to the live enquiry database. It measures HTTP acknowledgement latency, checks every saved enquiry and synthetic sender Reply-To, then verifies local notification receipt counts.

A successful run writes identical reports to `src/data/enquiry-benchmark.json` and `public/benchmarks/enquiry-pipeline.json`. The UI derives its values directly from the former; visitors can open the latter. Reports contain raw timing samples, environment/methodology, source SHA-256 hashes and scope limits.

This is a local website-backend benchmark, not a flagship workflow benchmark, production uptime measurement or client case study. Do not relabel it as one. Publish customer savings or deployment counts only when supported by approved evidence. Rebuild after intentionally refreshing the report.

The toolkit uses a rotating particle globe and eight circular tool badges moving on four orbit tracks with synchronized angular spacing from one animation clock within a square animation area. Hovering a tool badge pauses the visual for inspection; the explicit Pause/Resume control, reduced-motion preference, off-screen detection and hidden-tab handling govern animation. Tool names remain available in a static accessible legend.

Orbit tracks use a bounded square stage with badge clearance, so complete rotations stay visible at desktop and mobile sizes. Retell AI and Bolna AI use official unmodified white marks.

The hero sphere uses `public/flowtivo-mark.png`, an unchanged copy of the owner’s supplied transparent `F.png`. The prior outline letter has been removed.

Orbital motion translates badge positions without rotating their artwork. Every tool name remains visible below its mark throughout the orbit. Orbit radii reserve measured space for the complete badge and caption at every angle.
