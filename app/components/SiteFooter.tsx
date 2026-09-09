import Link from "next/link";
import { company, servicesForDisplay } from "../site-data";
import { BrandLogo } from "./BrandLogo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <BrandLogo context="footer" />
          <p>Professional winter risk management built around site-specific planning, accountable operations, and a clearer event record.</p>
          <a className="footer-phone" href={company.phoneHref} aria-label={`Call American Snow & Ice Solutions at ${company.phone}`}>{company.phone}</a>
        </div>
        <div>
          <p className="footer-heading">Operations</p>
          {servicesForDisplay.map((service) => <Link key={service.slug} href={`/services/${service.slug}`}>{service.shortTitle}</Link>)}
        </div>
        <div>
          <p className="footer-heading">Approach</p>
          <Link href="/winter-risk-plan">Winter risk planning</Link>
          <Link href="/technology-reporting">Technology &amp; reporting</Link>
          <Link href="/snow-ice-science">Snow &amp; ice science</Link>
          <Link href="/salt-brine">Salt brine &amp; anti-icing</Link>
          <Link href="/quote">Request a consultation</Link>
        </div>
        <div>
          <p className="footer-heading">Company</p>
          <Link href="/about">Our story</Link>
          <Link href="/service-areas">Service areas</Link>
          <Link href="/partner-network">Partner network</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
      <div className="container footer-base">
        <span>© Copyright 2024. All Rights Reserved American Snow &amp; Ice Solutions. Website by <a href="https://truecore.services/">TrueCore</a></span>
      </div>
    </footer>
  );
}
