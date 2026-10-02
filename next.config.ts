import type { NextConfig } from "next";

// Pages from the previous site that Google still lists, sent to their closest current page.
// Permanent (308) so search engines move their ranking history to the new address.
const legacyRedirects = [
  { source: "/where-we-serve", destination: "/service-areas" },
  { source: "/weather-reporting", destination: "/services/weather-reporting" },
  { source: "/risk-management", destination: "/services/risk-management" },
  { source: "/plowing-2", destination: "/services/commercial-plowing" },
  { source: "/de-icing-salting", destination: "/services/deicing-salting" },
];

const nextConfig: NextConfig = {
  output: "standalone",
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
