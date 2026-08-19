# American Snow & Ice Solutions

Premium multi-page website for American Snow & Ice Solutions, built with the standard Next.js App Router and ready for Vercel's GitHub-connected preview workflow.

## Requirements

- Node.js 22.13 or newer
- npm

## Local development

```bash
npm install
npm run dev
```

Open the local address printed by Next.js, normally `http://localhost:3000`.

## Validation

```bash
npm run lint
npm run build
npm test
```

The test suite builds the production application, starts it with `next start`, and verifies the primary pages, service routes, SEO endpoints, AI-readable summaries, branding asset, and standard Next.js configuration.

## Routes

- `/`
- `/services`
- `/services/commercial-plowing`
- `/services/deicing-salting`
- `/services/sidewalks-walkways`
- `/services/weather-reporting`
- `/services/risk-management`
- `/about`
- `/service-areas`
- `/schedule` (primary consultation workflow)
- `/quote` (legacy permanent redirect to `/schedule`)
- `/winter-risk-plan`
- `/technology-reporting`
- `/snow-ice-science`
- `/contact`
- `/partner-network`

SEO and discovery endpoints:

- `/sitemap.xml`
- `/robots.txt`
- `/manifest.webmanifest`
- `/llms.txt`
- `/llms-full.txt`

## Vercel preview setup

1. Import `ThePalantir/american-snow-ice-solutions` into Vercel.
2. Keep the detected framework as **Next.js**.
3. Use the repository defaults: `npm run build` and the standard `.next` output.
4. Leave the production domain unassigned until the preview has been approved.

Every pushed feature branch and pull request can then receive an isolated Vercel Preview Deployment. Production deployment and domain assignment remain separate approval steps.

## Brand and media

The selected American Snow & Ice Solutions logo is stored at `public/media/brand/asais-gpt-logo.png`. Approved source imagery and its retrieval manifest remain under `images/`; optimized site selections are under `public/media/`.
