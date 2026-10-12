import type { MetadataRoute } from "next";
import { services } from "./site-data";
import { absoluteUrl } from "./seo";

export default function sitemap(): MetadataRoute.Sitemap {
  // Omit optional lastmod until verified material page-change dates are available.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.7 },
    { url: absoluteUrl("/service-areas"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/winter-risk-plan"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/technology-reporting"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/snow-ice-science"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/salt-brine"), changeFrequency: "monthly", priority: 0.85 },
    { url: absoluteUrl("/quote"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.7 },
    { url: absoluteUrl("/partner-network"), changeFrequency: "yearly", priority: 0.5 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: absoluteUrl(`/services/${service.slug}`),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...serviceRoutes];
}
