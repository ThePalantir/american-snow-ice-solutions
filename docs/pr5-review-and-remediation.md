# PR #5 review and production remediation sequence

Reviewed October 14, 2026 against remote `main` at `2985e55c8b22e71568a315a3e083abdf97a100a6`. Original PR head: `3369ef830bdf761f0c06f3fe7615e681429a0a95`. All 11 original changed files were reviewed. No merge, deployment, account configuration, or host configuration changes were authorized or performed.

## Review findings and corrections

1. **P1: Google command queue format.** The original `gtag` wrapper pushed plain arrays. Google's documented wrapper pushes Arguments objects; arrays have different dataLayer semantics and cannot be relied upon to process these commands. Use the documented wrapper and assert the command object type in tests.
2. **P1: Withdrawal across tabs.** The original storage subscription updated React state but left an already loaded tag running in other tabs. Disable collection immediately with the measurement-specific `ga-disable-` flag and reload affected tabs after removal of their stored grant. Custom-event gating alone is insufficient for a loaded provider library.
3. **P2: Failed withdrawal persistence.** The original save swallowed storage errors, then reloaded and could reread the old grant. Failed writes now fail closed for this visit without reloading a stale grant. A later page load can still read an old preference if browser storage could not save withdrawal; the draft notice states this limitation. Regrant after a successful save reloads a disabled loaded tag.

The corrections preserve analytics-off defaults. Resend remains runtime-only, with the fixed operations recipient and visitor Reply-To. No lead database, new provider property, new secret, or hosting recipe is added. The new API marker denotes provider acceptance, not inbox delivery. Honeypot success lacks that marker.

## Validation evidence and limits

- `npm run lint` passes. `npm test` includes the production build, TypeScript checks, and all 20 passing tests. The two added tests cover withdrawal and failed persistence; initialization additionally asserts Arguments objects. Provider network calls are mocked.
- A separate isolated build with `G-TEST123456` and both activation flags passes. This is solely a local test build, not an approved analytics activation.
- Chrome: default-off build renders no analytics controls or Google script. Local mock harness verifies refusal, consent, one initialization/page view, route-change page views, phone/email/partner intent, one lead on provider acceptance, no lead on failed or honeypot-style responses, successful form UI when tracking throws, same-tab and cross-tab withdrawal, and failed preference writes. Event commands exclude URL query strings, referrer, link targets, and submitted form values.
- The browser harness rewrites attempted Google script insertion to a local inert script and mocks `/api/quote` responses. This tests the real client components, not Google request encoding or actual Resend delivery. The actual quote handler and SDK are covered separately with mocked provider fetch.
- Desktop layout was checked at about 1280 px. Narrow-layout controls and form interaction were checked; viewport automation became inconsistent (375-500 px observed), and narrow screenshot capture timed out. Exact 390 px device testing and Safari/Firefox are outstanding. A desktop screenshot of mocked form success was saved outside the repository.
- Homepage images load and the existing WeatherWidget.io frame is present. Its complete cookie/request inventory and privacy review remain outstanding.
- No real analytics collection or sending test occurred. Google tag interpretation, automatic events, cookie behavior, actual collection payloads, consent withdrawal network silence, ad blocking, and GA4 Realtime/DebugView remain activation gates.

Recommendation: the corrected preparation can proceed to review with analytics disabled. Approval to merge and deploy is still required. Full analytics activation is blocked by the notice, account verification, and real-provider browser/network validation. No GitHub review submissions or unresolved review threads were present at review time.

## Read-only production observations

`GET https://americansnowandicesolutions.com/health` returns 200, `Cache-Control: no-store`, service `american-snow-ice-solutions`, status `ok`, and build SHA `2985e55c8b22e71568a315a3e083abdf97a100a6`. This matches current main, not PR #5.

Both HTTP hosts redirect 308 to their own HTTPS hostname. HTTPS apex and HTTPS www `/quote` return 200; www currently does not redirect to apex. Sampled HTTPS responses retain nosniff, SAMEORIGIN, referrer and permissions policies but do not include HSTS, CSP, or CSP Report-Only. These observations do not verify the installed Caddy/catalog files or identify the authoritative infrastructure account. The preview hostname and its current behavior have not been verified.

## Ownership and access boundaries

| Workstream | Repository deliverable | External access / decision |
| --- | --- | --- |
| GA4 and consent | Queue/withdrawal fixes, events, regression tests, activation checklist | Existing ASIS Google Analytics property/stream ownership, linked destinations, enhanced measurement, retention, signals, key event, internal traffic and Realtime/DebugView. Google Analytics administration is distinct from Google Cloud administration; this implementation requires no new Cloud project or service-account credential. |
| Privacy | Final approved `/privacy` route, form/footer links, matching consent wording | Operator confirmation of legal entity, monitored contact, retention/deletion, Gmail/Resend and downstream handling, hosting logs, weather practices; final notice approval. |
| Canonical and preview hosts | Acceptance matrix and proposal only | Authoritative inventory and SecureServer/GoDaddy-reseller verification, coordination with active recovery work, current Droplet/catalog/Caddy/DNS/certificate access, explicit preview-alias policy. |
| HSTS and CSP | Asset/script inventory and any reviewed nonce/hash implementation | Host owner selects header layer, approves rollout and reloads Caddy; account/data approval for any reporting collector. Nonces may require dynamic rendering and change caching. |

## Ordered implementation and approval gates

1. Review the corrected PR and validation results. Recheck current main and exact PR head before merge. With explicit authorization, merge preparation with analytics flags absent/false. Deploy separately only after deployment authorization. Do not combine this deployment with host redirects or headers.
2. Before any host/DNS/mail-account changes, verify the Pichota Group Digital Infrastructure Inventory and the relevant SecureServer/GoDaddy-reseller account. Identify the actual Droplet, project catalog, dashboard, Caddy configuration path, upstream/service owner and preview host. Coordinate with any active infrastructure-recovery chat. Capture backups and approved rollback steps in the host's secure operations record, not in this repository.
3. Resolve all notice placeholders with the operator, approve final wording, and implement `/privacy` plus form/footer links in a separate PR. Publish the approved notice while analytics remains disabled. If analytics is planned next, wording must accurately describe the staged activation and verified account behavior; do not publish unsupported claims.
4. Verify the existing GA4 property and stream; record the ID without creating another property. Disable enhanced measurement/history/form/outbound/download events and advertising/signals; verify there are no unapproved linked destinations. Confirm retention and internal traffic settings. Do not set production activation flags yet.
5. In an approved nonproduction environment using that verified configuration and the published notice, test fresh/denied/granted/withdrawn/storage-blocked visits, two tabs, navigation, phone/email/partner intent, provider-failed/honeypot/accepted form responses and tag/ad blockers. Inspect actual Network payloads for PII, query/referrer leakage, duplicate events and post-withdrawal requests. Confirm Realtime/DebugView. Use mocked email or a separately authorized sending test with confirmed receipt.
6. After explicit activation authorization, set the three public build settings, rebuild and deploy. Consent must still precede tag loading. Confirm denial remains functional and delivery is unaffected. Saving environment settings alone does not update browser bundles or restart the running server.
7. In a separate host change window, apply the approved canonical www-to-apex rule after verifying the installed blocks. Preserve path/query strings, production routing, preview routing/noindex, certificates and upstreams. Inventory each preview alias: redirect only retired aliases approved for retirement; preserve the active preview host as an isolated noindex environment. Verify HTTP/HTTPS matrices, legacy URLs, health and form validation.
8. Stage HSTS at a short max-age (for example 300 seconds) after all production HTTPS hosts/certificates are verified. Extend only after observation. Omit includeSubDomains/preload until the relevant subdomain inventory and explicit approval are complete.
9. Deploy CSP Report-Only at one verified layer. Inventory Next.js hydration, JSON-LD, inline styles, image optimization, weather frame/script and consented Google domains. Select a reviewed hash or nonce strategy; verify caching/performance if dynamic rendering is introduced. Review browser violations across production/preview and consent states, then enforce only after another explicit authorization. Re-run form/navigation/assets/widget checks.

## Application deployment and rollback

These are instructions for a future authorized release, not executed steps.

- Record the current `/health` SHA, saved environment and previous runnable release. Confirm the effective catalog still uses Next.js standalone behind its existing launcher, never the obsolete `prepare-export.mjs` or a static `out/` export.
- Build the approved exact commit with `npm ci`, `npm run lint`, and `npm test`. Confirm the build SHA. Package `.next/standalone` with `public/` and `.next/static` in their proper runtime locations. Preserve the service-owned image-cache mount into `.next/cache` and read-only application files.
- Keep `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in runtime settings. Do not print/copy them into reports, logs, browser bundles or public variables. The sender domain must remain verified. Leave analytics flags absent/false for preparation and privacy-only releases.
- Use the verified ordinary dashboard deployment path, preserving the effective build/start recipe and saved environment. If a recipe problem exists, the host operator repairs the effective catalog first; retrying deployment/environment saves cannot repair it.
- Check expected SHA at public `/health`, all primary pages, redirects, static assets, optimized images, desktop/narrow navigation, form error/success behavior and analytics-off behavior. Use non-sending API validation initially. A live delivery test requires separate authorization and recipient confirmation.
- On regression, redeploy the previously recorded runnable SHA through the same verified dashboard with the preserved environment. Recheck `/health`, assets and form behavior. For analytics rollback, disable its build flag and rebuild/redeploy; a runtime-only edit is insufficient. Already open tabs can retain old JavaScript until reloaded, and collected data is not undone by rollback.

## Caddy deployment and rollback

No host paths or service names are assumed. The host operator must replace these placeholders with verified absolute paths and record the executable commands before authorization:

```sh
caddy validate --config <candidate-config> --adapter caddyfile
caddy reload --config <installed-config> --adapter caddyfile
```

Back up the installed configuration and its authoritative saved catalog fragment together before applying the approved candidate. Validate the full effective configuration, not merely the sample block. Reload only after validation succeeds. Verify valid TLS, path/query preservation, no loops, expected preview noindex, health identity, optimized images and non-sending form validation. If acceptance fails, restore both recorded installed and saved catalog configurations, validate the restored full configuration and reload through the verified service procedure.

For CSP rollback, remove/restore the new enforcing policy while retaining established headers, validate and reload. For HSTS rollback, restore HTTPS service first and serve `Strict-Transport-Security: max-age=0` over valid HTTPS if revocation is required. Previously cached HSTS remains in clients until they receive revocation or it expires; reverting a file or deleting the header alone does not immediately undo it. Permanent redirects may also remain cached, which is another reason to approve alias policy before rollout.

References: [Google tag installation](https://developers.google.com/tag-platform/gtagjs), [Google privacy controls](https://developers.google.com/tag-platform/security/guides/privacy), [Caddy redirects](https://caddyserver.com/docs/caddyfile/directives/redir), [Next.js CSP](https://nextjs.org/docs/app/guides/content-security-policy).
