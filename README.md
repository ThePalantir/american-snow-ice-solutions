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

## Quote request email

The `/quote` form sends consultation requests through Resend to
`Piechotagrpinc@gmail.com`. Configure these server-side environment
variables in each deployed environment:

```bash
RESEND_API_KEY=re_replace_with_server_side_key
RESEND_FROM_EMAIL=American Snow & Ice Solutions <website@your-verified-domain.example>
```

`RESEND_FROM_EMAIL` must use a sending domain already verified in Resend. Never
expose `RESEND_API_KEY` to browser code or commit it to the repository.

In the operations dashboard, paste the two lines into this project's environment
variables, save, then **Deploy saved settings** so the running process receives
them. These are runtime variables; they do not need build-time exposure or a
`NEXT_PUBLIC_` prefix. The recipient is `Piechotagrpinc@gmail.com`, and
Reply-To is the visitor's submitted email address.

The host must run the Next.js server, not a static `out/` export: static hosting
cannot execute `POST /api/quote`. For self-hosting, `npm run build` produces
`.next/standalone/server.js`. Copy `public/` into `.next/standalone/public/` and
`.next/static/` into `.next/standalone/.next/static/`, then run that server with
the host's `HOSTNAME`, `PORT`, and the two Resend variables. `GET /health` preserves
the application's service identity for host monitoring. The legacy host's static
export recipe needs a one-time switch to this server artifact before environment
variables alone can enable email.

## Validation

```bash
npm run lint
npm run build
npm test
```

The test suite builds and starts the standalone production server and verifies the primary pages, service routes, health and quote endpoints, SEO endpoints, AI-readable summaries, and branding asset. Email tests exercise the real Resend SDK with mocked network responses; no real emails are sent.

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
- `/quote` (primary consultation request workflow)
- `/schedule` (legacy permanent redirect to `/quote`; no calendar is currently published)
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

The selected American Snow & Ice Solutions logo is stored at `public/media/brand/asis-2026-logo-v2.png`. Approved source imagery and its retrieval manifest remain under `images/`; optimized site selections are under `public/media/`.
