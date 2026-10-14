# Measurement and hosting readiness

Prepared October 12, 2026. Application preparation is independent of Google account access. No analytics property, hosting configuration, or public privacy notice is changed by this draft.

## Analytics activation gates

The application does not load the Google tag or show analytics controls unless all three build-time settings are configured:

```
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-[existing-ASIS-stream-ID]
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_PRIVACY_NOTICE_APPROVED=true
```

Leave the two flags unset until the notice is published and approved. These are public build settings, not secrets. Rebuild/redeploy after changing them. Do not create a duplicate property or reuse TrueCore's property without verifying ASIS ownership.

Before activation, verify the Google tag has no additional linked destinations, disable enhanced measurement (including automatic history page views, form interactions, outbound clicks, and downloads), and disable advertising features/Google signals. The custom implementation owns page-view and conversion events; automatic measurement can duplicate events or transmit URLs independently of our sanitization. Confirm property retention and internal-traffic handling.

No Google script is requested before analytics consent. Browser preference storage must be available for consent to persist; if unavailable, analytics stays off. Withdrawal immediately disables Google collection and custom tracking, then reloads to unload the tag, including in other open tabs when their stored grant is removed. If saving withdrawal fails, collection remains disabled for this visit without reloading a stale stored grant; a future visit may read that old preference. Existing Google cookies are not automatically removed. The existing weather widget is independent of analytics consent.

| Event | Trigger | Meaning |
|---|---|---|
| `page_view` | Initial consented visit and route changes | Page visit; URL query/hash and referrer omitted |
| `generate_lead` | Successful API response with `providerAccepted: true` | Resend accepted the email; does not prove inbox delivery |
| `phone_click` | Telephone link click | Intent to call; does not prove a connected call |
| `email_click` | Email link click | Intent to email; does not prove a sent message |
| `partner_inquiry` | Email link click on partner-network page | Partner contact intent; does not prove submission |

No form fields, recipient addresses, or arbitrary URL paths are passed to custom events. Unknown routes are reported as `/other`. Campaign attribution is intentionally deferred: accepting arbitrary query values would undermine the current data-minimization design. No event value/revenue is fabricated.

Acceptance: verify no Google requests before consent and after denial; consented page views occur once per navigation; failed/honeypot submissions generate no lead; a provider-accepted submission generates one lead; form still works when analytics is unavailable. Inspect actual network payloads for PII and duplicate events. Validate in GA4 Realtime/DebugView and mark only the intended lead event as a key event. A real sending test requires an authorized recipient; unit tests mock the provider.

## Hostname change — proposed, not applied

Inspect the current authoritative infrastructure inventory and installed Caddy/project catalog configuration first. Preserve production and separate preview routing, preview noindex headers, upstream ports, certificates, runtime secrets, and rollback configuration. Do not assume a dashboard URL identifies the authoritative hosting system.

Proposed standalone Caddy block, to reconcile with the installed configuration:

```caddyfile
www.americansnowandicesolutions.com {
    redir https://americansnowandicesolutions.com{uri} 308
}
```

Use a dedicated www block rather than inserting an unconditional redirect into a block that also serves the root domain. Validate configuration before reload. Verify HTTP and HTTPS on both hosts, paths, query preservation, valid certificates, no redirect loops, health and form behavior. Keep preview behavior intact.

## Security headers — proposed, not applied

Preserve the existing MIME, framing, referrer, and permissions headers. Add HSTS only after verifying HTTPS on every production hostname; start with a short max-age, then extend after validation. Do not add `includeSubDomains` or preload until every relevant subdomain is inventoried and approved.

Prepare CSP in `Content-Security-Policy-Report-Only` first. Inventory Next.js inline bootstrap/hydration scripts, styles, images, weather-widget frames/requests, and the consented Google tag. Select static-compatible hashes or a reviewed nonce/rendering approach instead of adding a blanket policy that breaks hydration. Nonces can require dynamic rendering and change caching/performance. Report-only warnings need browser review; do not configure a reporting collector without verifying its storage and privacy behavior.

Test desktop/mobile navigation, image optimization, weather widget, successful and failed form behavior, analytics consent, and preview pages before enforcement. Do not add obsolete headers or duplicate conflicting policies at both Caddy and application layers. Record exact configuration, validation output, deployment owner, and rollback command before production changes.

Sources: Google tag API https://developers.google.com/tag-platform/gtagjs/reference ; consent guidance https://developers.google.com/tag-platform/security/guides/consent ; Caddy redirect patterns https://caddyserver.com/docs/caddyfile/patterns ; Caddy headers https://caddyserver.com/docs/caddyfile/directives/header ; Next.js CSP https://nextjs.org/docs/app/guides/content-security-policy .
