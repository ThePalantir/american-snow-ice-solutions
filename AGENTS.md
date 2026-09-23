# Repository handoff

- Keep email support minimal: the existing `POST /api/quote` handler uses runtime-only `RESEND_API_KEY` and `RESEND_FROM_EMAIL`. It sends to the fixed recipient `troy.stone@truecore.services` and sets Reply-To to the visitor's email. Never expose the API key through browser code or `NEXT_PUBLIC_` variables.
- Self-hosted deployments must run the Next.js server. Use the standalone output plus `public/` and `.next/static/`; a static `out/` export cannot run the email endpoint. Preserve the identity-bearing `GET /health` response.
- The existing host was still using an external static-export recipe when inspected on 2026-09-23. The standalone change requires a coordinated host recipe update and deployment; source changes alone do not switch that runtime. Host configuration stays outside this repository. Do not claim live email delivery from mocked tests.
- Dashboard environment saves require deployment/restart to reach the running process. The sender domain must already be verified in Resend. The email API key is not needed during build.
- Run `npm run lint` and `npm test`. Email tests must mock the provider instead of sending messages.
