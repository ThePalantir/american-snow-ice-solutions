import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "American Snow & Ice Solutions",
    short_name: "ASAI",
    description: "Commercial snow and ice management for demanding properties across the region.",
    start_url: "/",
    display: "standalone",
    background_color: "#06111e",
    theme_color: "#06111e",
    icons: [
      {
        src: "/media/brand/asis-2026-logo.png",
        sizes: "1312x1199",
        type: "image/png",
      },
    ],
  };
}
