import type { Metadata } from "next";
import "./design-tokens.css";
import "./globals.css";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { StructuredData } from "./components/StructuredData";
import { absoluteUrl, defaultDescription, siteName, siteUrl } from "./seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Professional Winter Risk Management`,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "Commercial snow and ice management",
  keywords: [
    "commercial snow removal",
    "commercial snow plowing",
    "snow and ice management",
    "de-icing services",
    "sidewalk snow removal",
    "winter risk management",
    "Lehigh Valley snow removal",
    "Pennsylvania commercial snow contractor",
  ],
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: "/media/brand/asis-2026-logo.png",
    shortcut: "/media/brand/asis-2026-logo.png",
  },
  openGraph: {
    title: `${siteName} | Professional Winter Risk Management`,
    description: "Site-specific snow and ice planning, accountable winter operations, and documented closeout for commercial properties.",
    url: siteUrl,
    siteName,
    locale: "en_US",
    type: "website",
    images: [{ url: "/og.png", width: 1730, height: 907, alt: "American Snow & Ice Solutions commercial winter operations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Professional Winter Risk Management`,
    description: "Site-specific snow and ice planning, accountable winter operations, and documented closeout for commercial properties.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-design-direction="midnight-operations">
      <body>
        <StructuredData
          data={[
            {
              "@context": "https://schema.org",
              "@type": ["LocalBusiness", "ProfessionalService"],
              "@id": `${siteUrl}/#business`,
              name: siteName,
              alternateName: "ASAI",
              url: siteUrl,
              logo: absoluteUrl("/media/brand/asis-2026-logo.png"),
              image: absoluteUrl("/og.png"),
              telephone: "+1-610-760-0600",
              email: "info@americansnowandice.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "4531 Lehigh Drive",
                addressLocality: "Walnutport",
                addressRegion: "PA",
                postalCode: "18088",
                addressCountry: "US",
              },
              areaServed: [
                { "@type": "State", name: "Pennsylvania" },
                { "@type": "State", name: "New Jersey" },
                { "@type": "State", name: "New York" },
                { "@type": "State", name: "Delaware" },
              ],
              knowsAbout: [
                "Commercial snow plowing",
                "De-icing and salting",
                "Salt brine and anti-icing",
                "Sidewalk snow removal",
                "Weather reporting",
                "Winter risk management",
              ],
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "08:00",
                  closes: "17:00",
                },
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-610-760-0600",
                contactType: "customer service",
                areaServed: "US",
                availableLanguage: "English",
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${siteUrl}/#website`,
              url: siteUrl,
              name: siteName,
              publisher: { "@id": `${siteUrl}/#business` },
              inLanguage: "en-US",
            },
          ]}
        />
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <div id="main-content">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
