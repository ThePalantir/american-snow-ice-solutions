import Link from "next/link";
import Image from "next/image";
import { company, services } from "../site-data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Image src="/media/brand/asais-gpt-logo.png" alt="American Snow & Ice Solutions" width={1505} height={534} />
          <p>Commercial snow and ice management engineered around safer properties, clearer communication, and reliable winter operations.</p>
          <a className="footer-phone" href={company.phoneHref}>{company.phone}</a>
        </div>
        <div>
          <p className="footer-heading">Operations</p>
          {services.map((service) => <Link key={service.slug} href={`/services/${service.slug}`}>{service.shortTitle}</Link>)}
        </div>
        <div>
          <p className="footer-heading">Company</p>
          <Link href="/about">Our story</Link>
          <Link href="/service-areas">Service areas</Link>
          <Link href="/partner-network">Partner network</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="footer-contact">
          <p className="footer-heading">Operations center</p>
          <p>{company.address}</p>
          <a href={company.emailHref}>{company.email}</a>
          <p>Office: Mon–Fri, 8am–5pm<br />Emergency services: 24/7</p>
          <Link className="button button--light button--small" href="/quote">Request a site review</Link>
        </div>
      </div>
      <div className="container footer-base">
        <span>© {new Date().getFullYear()} American Snow & Ice Solutions</span>
        <span>A Piechota Group LLC company</span>
        <span>Built for winter readiness.</span>
      </div>
    </footer>
  );
}
