import Link from "next/link";
import Image from "next/image";
import { company } from "../site-data";
import { makeMetadata } from "../seo";

export const metadata = makeMetadata({ title: "Contact", description: "Contact American Snow & Ice Solutions in Walnutport, Pennsylvania.", path: "/contact" });

export default function ContactPage() {
  return (
    <main>
      <section className="page-hero"><div className="container"><p className="eyebrow eyebrow--light major-section-label">Contact operations</p><h1>Ready when winter calls.</h1><p>Talk with the team about a property, an active service need, or the upcoming season.</p></div></section>
      <section className="section"><div className="container contact-grid"><div className="contact-primary"><p className="eyebrow major-section-label">Operations center</p><h2>{company.address}</h2><a className="contact-phone" href={company.phoneHref} aria-label={`Call American Snow & Ice Solutions at ${company.phone}`}>{company.phone}</a><a className="contact-email" href={company.emailHref}>Email {company.email}</a></div><div className="contact-card"><span>Office hours</span><strong>Monday–Friday</strong><p>8:00am–5:00pm</p><hr/><span>Winter event support</span><strong>Emergency services</strong><p>Available 24/7</p></div><div className="contact-actions"><Link className="button button--signal" href="/quote">Request a risk consultation <span aria-hidden="true">↗</span></Link><Link className="button button--secondary" href="/partner-network">Service partner network <span aria-hidden="true">→</span></Link></div></div></section>
      <section className="contact-visual"><Image src="/media/operations/active-storm-commercial.jpg" alt="Commercial plow truck clearing an office property during active snowfall" fill quality={90} sizes="(max-width: 760px) 100vw, 58vw"/><div><p className="eyebrow eyebrow--light major-section-label">Active storm support</p><h2>Current clients can reach their assigned snow supervisor throughout a winter event.</h2></div></section>
    </main>
  );
}
