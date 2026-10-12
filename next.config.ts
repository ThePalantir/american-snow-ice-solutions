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
    return legacyRedirects.map((redirect) => ({ ...redirect, permanent: true }));
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2560],
  },
};

export default nextConfig;
