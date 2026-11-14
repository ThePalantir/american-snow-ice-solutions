# American Snow & Ice Solutions

Premium multi-page website for American Snow & Ice Solutions, built with the standard Next.js App Router and ready for Vercel's GitHub-connected preview workflow.

## Requirements

- Node.js 22.23.4 or a later Node 22 release
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

For self-hosting, `npm run build:standalone` prepares the Next.js server and
its public and static assets under `.next/standalone/`. Start that package's
`server.js` with the host's `HOSTNAME`, `PORT`, and runtime variables for the
consultation form and owner inbox. `GET /health` preserves
the application's service identity for host monitoring and includes a non-secret `buildSha` captured at build time. Builds without a Git checkout should set `ASIS_BUILD_SHA` to the full 40-character source commit SHA before building; otherwise the endpoint reports `unknown`. The response is not cached. The legacy host's static
export recipe needs a one-time switch to this server artifact before environment
variables alone can enable email.

## Owner inbox

Use **Owner sign-in** in the website footer or open `/dashboard`. The inbox shows
received messages, with sender, subject, Eastern time, message text and attachment
names. It reads Resend on demand. Sessions expire after eight hours or when the
standalone server restarts.

Set the following runtime variables privately in the Ops Dashboard:

| Variable | Value |
| --- | --- |
| `DASHBOARD_USERNAME` | `admin` |
| `DASHBOARD_PASSWORD` | A strong password of 16 to 256 characters |
| `RESEND_RECEIVING_API_KEY` | A dedicated key with access to the company's Resend Receiving API |
| `RESEND_INBOX_RECIPIENTS` | Comma-separated company recipient addresses appearing in the To, Cc or Bcc metadata returned by Resend |

Resend lists received mail at the team level. Prefer a company-owned team for the
receiving key. Confirm an example received message in Resend and use the exact
company recipient address shown there. Mail that continues to arrive only in an
existing mailbox needs an approved forwarding route into Resend to appear in this
inbox. Check the existing mail configuration before changing any routing or MX
records. The outbound consultation form continues to use its existing settings.

The repository-root [deployment.yaml](deployment.yaml) declares the standalone
server and the required runtime keys. New-project onboarding can discover it
from the selected branch. For an existing Ops Dashboard project without manifest
updates enabled, keep its saved standalone recipe, add the new runtime values
in Project details and deploy the saved settings and current source through
the existing project.

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

## Optional measurement preparation

Analytics is disabled by default. Activation requires an existing GA4 ID, explicit enablement, and privacy approval at build time, then visitor opt-in. See `docs/measurement-and-hosting-readiness.md` for the property settings and activation checklist. `docs/privacy-notice-draft.md` is an internal draft and is not a public notice. No hostname or host security configuration is changed by this preparation.

## Migration acceptance

The seven known legacy routes redirect permanently to their current equivalents. Tests cover both trailing-slash variants, working destinations, and preservation of campaign query parameters. This list remains a minimum inventory until historical URLs are exported from Search Console.

The sitemap omits optional `lastmod` values rather than publishing a shared, unverified date. Add per-page dates only when they reflect verified material content changes. Do not substitute deployment or request timestamps.
