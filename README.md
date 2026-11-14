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
Reply-To is the visitor's submitted email address. After Resend accepts the Gmail
notification, the handler sends an independent copy to `RESEND_QUOTE_INBOX_ADDRESS`
when configured. An error sending the copy is logged separately and the visitor
still receives confirmation for the accepted Gmail notification.

For self-hosting, `npm run build:standalone` prepares the Next.js server and
its public and static assets under `.next/standalone/`. Start that package's
`server.js` with the host's `HOSTNAME`, `PORT`, and runtime variables for the
consultation form and owner inbox. `GET /health` preserves
the application's service identity for host monitoring and includes a non-secret `buildSha` captured at build time. Builds without a Git checkout should set `ASIS_BUILD_SHA` to the full 40-character source commit SHA before building; otherwise the endpoint reports `unknown`. The response is not cached. The legacy host's static
export recipe needs a one-time switch to this server artifact before environment
variables alone can enable email.

## Owner inbox

Use **Owner sign-in** in the website footer or open `/dashboard`. **Website inquiries**
shows locally saved messages and counts over the last 7 and 30 days. The quote
server saves new inquiries in SQLite after Resend accepts the Gmail notification.
If writing the archive fails, the existing email delivery continues. Sessions
expire after eight hours or when the standalone server restarts.

Only submissions recorded directly by the website's quote form appear in this
history. Older mail stays in Gmail and in Resend for its normal retention period.
Open a saved inquiry and select **Archive** to move it out of the Inbox. Find it
under **Archived** and select **Restore to Inbox** to bring it back. Archive status
does not affect inquiry counts or either delivered email copy.

SQLite uses `inquiries.sqlite` in the private writable directory
`data/inquiries` relative to the running standalone server by default. The
deployment manifest provisions that directory outside the release for YAML-managed
hosts. For imported/custom host recipes, set `ASIS_INQUIRY_DATA_DIR` to a stable,
absolute directory writable by the website service. Keep the database private
and back it up with SQLite's backup tooling if inquiry history must survive
host or storage loss. The application does not automatically purge saved inquiries.

Set the following runtime variables privately in the Ops Dashboard:

| Variable | Value |
| --- | --- |
| `DASHBOARD_USERNAME` | `admin` |
| `DASHBOARD_PASSWORD` | A strong password of 16 to 256 characters |
| `RESEND_QUOTE_INBOX_ADDRESS` | One dedicated address, such as `website-quotes@<your-team-id>.resend.app`, from the company's Resend team |

1. In the company's Resend team, open **Emails → Receiving**,
   open the three-dot menu and copy the **Receiving address** domain. Use
   `website-quotes` before the `@`. Resend accepts any username at the team's
   provided domain. No webhook or site DNS change is required.
2. Enter the full address in **Ops Dashboard → Project details → Required to
   deploy**, save and deploy. The manifest reuses the saved sign-in and sending
   settings. The application no longer uses `RESEND_INBOX_RECIPIENTS` or
   `RESEND_RECEIVING_API_KEY`.
3. Submit one clearly labeled test from `/quote`. Confirm the usual Gmail
   message and a copy in **Resend → Emails → Receiving**, then sign in and
   refresh `/dashboard`. The new setup captures new form submissions. Mail sent
   directly to Gmail and existing Gmail threads remain in Gmail.

The repository-root [deployment.yaml](deployment.yaml) declares the standalone
server and the required runtime keys.

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
