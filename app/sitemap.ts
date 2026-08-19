import type { MetadataRoute } from "next";
import { services } from "./site-data";
import { absoluteUrl } from "./seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-19T12:00:00-04:00");
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/services"), lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/about"), lastModified, changeFrequency: "yearly", priority: 0.7 },
    { url: absoluteUrl("/service-areas"), lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/winter-risk-plan"), lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/technology-reporting"), lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/snow-ice-science"), lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/schedule"), lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/contact"), lastModified, changeFrequency: "yearly", priority: 0.7 },
    { url: absoluteUrl("/partner-network"), lastModified, changeFrequency: "yearly", priority: 0.5 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: absoluteUrl(`/services/${service.slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...serviceRoutes];
}
