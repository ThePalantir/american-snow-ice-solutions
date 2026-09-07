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
          <a className="button button--signal button--footer" href={company.phoneHref} aria-label={`Call American Snow & Ice Solutions at ${company.phone}`}>Call {company.phone}</a>
        </div>
        <div>
          <p className="footer-heading">Operations</p>
          {servicesForDisplay.map((service) => <Link className="button button--signal button--footer" key={service.slug} href={`/services/${service.slug}`}>{service.shortTitle}</Link>)}
        </div>
        <div>
          <p className="footer-heading">Approach</p>
          <Link className="button button--signal button--footer" href="/winter-risk-plan">Winter risk planning</Link>
          <Link className="button button--signal button--footer" href="/technology-reporting">Technology &amp; reporting</Link>
          <Link className="button button--signal button--footer" href="/snow-ice-science">Snow &amp; ice science</Link>
          <Link className="button button--signal button--footer" href="/salt-brine">Salt brine &amp; anti-icing</Link>
          <Link className="button button--signal button--footer" href="/quote">Request a consultation</Link>
        </div>
        <div>
          <p className="footer-heading">Company</p>
          <Link className="button button--signal button--footer" href="/about">Our story</Link>
          <Link className="button button--signal button--footer" href="/service-areas">Service areas</Link>
          <Link className="button button--signal button--footer" href="/partner-network">Partner network</Link>
          <Link className="button button--signal button--footer" href="/contact">Contact</Link>
        </div>
      </div>
      <div className="container footer-base">
        <span>© Copyright 2024. All Rights Reserved American Snow &amp; Ice Solutions. Website by <a className="button button--signal button--footer button--credit" href="https://truecore.services/">TrueCore</a></span>
      </div>
    </footer>
  );
}
