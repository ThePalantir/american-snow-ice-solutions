import type { NextConfig } from "next";
import { execFileSync } from "node:child_process";

// Capture the source revision during the build; standalone runtime has no Git checkout.
function buildSha(): string {
  const configured = process.env.ASIS_BUILD_SHA;
  if (configured && /^[a-f0-9]{40}$/i.test(configured)) return configured;
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "unknown";
  }
}

// Pages from the previous site that Google still lists, sent to their closest current page.
// Permanent (308) so search engines move their ranking history to the new address.
const legacyRedirects = [
  { source: "/snow-ice-quote", destination: "/quote" },
  { source: "/sidewalks", destination: "/services/sidewalks-walkways" },
  { source: "/where-we-serve", destination: "/service-areas" },
  { source: "/weather-reporting", destination: "/services/weather-reporting" },
  { source: "/risk-management", destination: "/services/risk-management" },
  { source: "/plowing-2", destination: "/services/commercial-plowing" },
  { source: "/de-icing-salting", destination: "/services/deicing-salting" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  env: { ASIS_BUILD_SHA: buildSha() },
  async redirects() {
    // The www address served a duplicate copy of the site; send it to the main address (PG-07).
    // Only the exact production www host matches, so preview hosts and localhost are untouched.
    const wwwToMain = {
      source: "/:path*",
      has: [{ type: "host" as const, value: "www.americansnowandicesolutions.com" }],
      destination: "https://americansnowandicesolutions.com/:path*",
      permanent: true,
    };
    return [wwwToMain, ...legacyRedirects.map((redirect) => ({ ...redirect, permanent: true }))];
  },
  async headers() {
    return [{
      // HSTS on the production host only, no includeSubDomains or preload. One day to start; raise after a clean week (PG-08).
      source: "/:path*",
      has: [{ type: "host" as const, value: "americansnowandicesolutions.com" }],
      headers: [{ key: "Strict-Transport-Security", value: "max-age=86400" }],
    }, {
      // Baseline Content-Security-Policy (PG-08): only directives that cannot break page scripts or styles.
      // A script-src policy still needs testing against the weather widget and optional analytics.
      source: "/:path*",
      headers: [{ key: "Content-Security-Policy", value: "base-uri 'self'; object-src 'none'; form-action 'self'; frame-ancestors 'self'" }],
    }, {
      source: "/dashboard/:path*",
      headers: [
        { key: "Content-Security-Policy", value: "base-uri 'self'; object-src 'none'; form-action 'self'; frame-ancestors 'none'" },
        { key: "Cache-Control", value: "private, no-store, max-age=0, must-revalidate" },
        { key: "X-Robots-Tag", value: "noindex, nofollow" },
        { key: "Referrer-Policy", value: "same-origin" },
        { key: "X-Frame-Options", value: "DENY" },
      ],
    }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2560],
  },
};

export default nextConfig;
