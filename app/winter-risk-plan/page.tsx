import Image from "next/image";
import Link from "next/link";
import { makeMetadata } from "../seo";

export const metadata = makeMetadata({
  title: "Site-Specific Winter Risk Planning",
  description: "Build a commercial snow and ice plan around property access, operating hours, shift changes, deliveries, priority zones, and communication requirements.",
  path: "/winter-risk-plan",
});

const planningInputs = [
  ["Property movement", "Entrances, exits, traffic flow, loading lanes, fire routes, pedestrian crossings, and accessible routes."],
  ["Business timing", "Opening deadlines, shift changes, deliveries, tenant activity, visitor peaks, and critical production windows."],
  ["Site conditions", "Drainage, refreeze areas, shade, slopes, wind exposure, storage constraints, and recurring trouble spots."],
  ["Response priorities", "Zones that must open first, service triggers, escalation paths, completion standards, and authorized contacts."],
  ["Resource plan", "Equipment matched to site scale, assigned operators, material strategy, backups, and supervisory coverage."],
  ["Event record", "Weather inputs, field observations, service times, photos, materials, exceptions, and closeout review."],
];

export default function WinterRiskPlanPage() {
  return (
    <main>
      <section className="subhero">
        <Image className="subhero__image" src="/media/operations/risk-management.jpg" alt="Commercial snow operations working through a winter event" fill sizes="(max-width: 1050px) 100vw, 64vw" quality={90} priority />
        <div className="subhero__scrim" />
        <div className="container subhero__content"><p className="eyebrow eyebrow--light">Site-specific winter planning</p><h1>Your property should not run on a generic snow plan.</h1><p>We learn how the site operates, identify the highest-consequence winter exposures, and align the response before the season begins.</p><Link className="button button--signal" href="/quote">Request a risk consultation <span aria-hidden="true">↗</span></Link></div>
      </section>

      <section className="section"><div className="container two-column"><div><p className="eyebrow">Learn the business</p><h2>The operating schedule shapes the snow schedule.</h2></div><div className="prose-large"><p>A distribution center, medical property, retail center, and corporate campus can experience the same storm very differently. The right plan accounts for who arrives, what must move, which surfaces carry the most exposure, and when each area must be ready.</p><p className="planning-promise">We take the stress out of winter.</p></div></div></section>

      <section className="section section--tint"><div className="container"><div className="section-heading"><p className="eyebrow">Planning inputs</p><h2>What we document before winter.</h2></div><div className="detail-grid">{planningInputs.map(([title, detail]) => <article key={title}><h3>{title}</h3><p>{detail}</p></article>)}</div></div></section>

      <section className="section section--dark"><div className="container"><div className="section-heading section-heading--light"><p className="eyebrow eyebrow--light">One accountable process</p><h2>From discovery to verified closeout.</h2></div><div className="process-line process-line--dark">{[["1","Discover","Interview property stakeholders and walk the site."],["2","Design","Set priorities, triggers, resources, and communication paths."],["3","Prepare","Confirm maps, contacts, equipment, materials, and contingencies."],["4","Operate","Monitor, dispatch, supervise, communicate, and document."],["5","Review","Close out the event and identify follow-up needs."]].map(([number,title,detail]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{detail}</p></article>)}</div></div></section>

      <section className="section"><div className="container two-column"><div><p className="eyebrow">Risk support, clearly stated</p><h2>A stronger layer of winter documentation.</h2></div><div className="prose-large"><p>Planning, communication, weather information, and service records can support property operations and post-event review. American Snow &amp; Ice Solutions is not an insurer, attorney, or guarantor against incidents; its role is to provide professional snow and ice management and a clearer operational record.</p><Link className="text-link" href="/technology-reporting">See how operations are documented →</Link></div></div></section>

      <section className="cta-band"><div className="container cta-band__inner"><div><p className="eyebrow eyebrow--light">Build the plan early</p><h2>Bring us the property—not just the square footage.</h2></div><Link className="button button--light" href="/quote">Request a consultation <span aria-hidden="true">↗</span></Link></div></section>
    </main>
  );
}
