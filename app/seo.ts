import type { Metadata } from "next";

export const siteUrl = "https://americansnowandicesolutions.com";
export const siteName = "American Snow & Ice Solutions";
export const defaultDescription =
  "Commercial snow plowing, de-icing, sidewalk clearing, weather reporting, and winter risk management across eastern Pennsylvania and surrounding regions.";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function makeMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const canonical = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url: canonical,
      siteName,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: absoluteUrl("/og.png"),
          width: 1730,
          height: 907,
          alt: `${siteName} commercial winter operations`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
      images: [absoluteUrl("/og.png")],
    },
  };
}
