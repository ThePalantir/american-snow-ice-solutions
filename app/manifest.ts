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
        src: "/media/brand/asais-gpt-icon.png",
        sizes: "152x120",
        type: "image/png",
      },
    ],
  };
}
