# Flowtivo AI

A responsive, dark-themed marketing site for companies with 50–500 employees. React + TypeScript, Tailwind CSS, shadcn/ui, Framer Motion and React Router. A lightweight custom canvas supplies the constellation effect instead of tsParticles, as allowed in the brief.

The Sites Vinext adapter provides server rendering and the `/api/contact` backend. Contact enquiries persist in Cloudflare D1; no email delivery or calendar service is implied. The contact endpoint exposes no public read API.

## Development

Node.js 22.13+ required.

```sh
npm install
npm run dev
npm run typecheck
npm run build
```

For local contact submissions, generate a build and apply the checked-in migration to local D1 before starting the production preview:

```sh
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_dazzling_mesmero.sql
npm start
```

Use the actual generated SQL filename in `drizzle/`. The hosted Sites workflow provisions D1 and applies schema migrations when publishing.

## Content editing

- `src/data/metrics.ts`: every sample headline metric and disclaimer.
- `src/data/projects.ts`: illustrative project descriptions and before/after figures.
- `src/data/testimonials.ts`: explicitly illustrative quotes; no invented client endorsements.
- `src/data/team.ts`: profile placeholders; populate approved names, bios, photos and social links.
- `src/data/content.ts`: services, solutions, departments, FAQ, email and brand settings.

The supplied original logo is in `public/flowtivo-logo.png`. `brand.logoPath` in `src/data/content.ts` controls its location. It appears unmodified on a light pill in the navigation, hero and footer.

Replace illustrative metrics, projects and quotes with approved evidence before using them as actual business claims. Keep labels until verified.

Booking calendar is intentionally an explicit placeholder. All booking buttons lead to the functional enquiry form; email scheduling also works. Add an approved scheduling integration when ready.

## Backend and privacy

The contact route validates required fields, employee-count choices, email, phone and consent server-side; it rejects cross-origin submissions, large payloads and a filled honeypot. Failed saves show an error and email fallback. Success appears only after the database insert completes. No sensitive payloads are logged. Enquiries can be inspected by the owner through Sites database tools.

For a public production launch, agree an operational process for reviewing enquiries, retention/deletion and abuse controls. The current hosted preview is owner-private.

## Deployment

`.openai/hosting.json` retains Sites identity and D1 binding. Deploy using the Sites workflow. The source also includes its local preview/build scripts.

Vercel CLI is not installed. `npm i -g vercel` enables Vercel CLI workflows, but this backend currently targets Cloudflare D1 through Sites; a Vercel deployment would require a compatible database adapter.

## Assets and components

No stock images, fabricated client logos or generated portraits. Plus Jakarta Sans is bundled locally via `@fontsource/plus-jakarta-sans` (SIL OFL). Lucide icons and existing shadcn/Radix components use their package licenses. All diagrams and CSS illustrations are original. Tool names indicate integration options, not partnerships.
