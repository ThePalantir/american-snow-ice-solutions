import Link from "next/link";
import Image from "next/image";
import { QuoteForm } from "./components/QuoteForm";
import { company, propertyTypes, services } from "./site-data";
import { makeMetadata } from "./seo";

export const metadata = makeMetadata({
  title: "Commercial Winter Operations",
  description: "Commercial snow and ice management for properties that cannot afford to slow down across eastern Pennsylvania and surrounding regions.",
  path: "/",
});

export default function Home() {
  return (
    <main>
      <section className="hero">
        <Image className="hero__image" src="/media/operations/hero-snow-removal.jpg" alt="Commercial snow removal equipment clearing a parking lot" fill sizes="100vw" priority />
        <div className="hero__overlay" />
        <div className="hero__grid" aria-hidden="true" />
        <div className="container hero__content">
          <div className="hero__copy">
            <p className="eyebrow eyebrow--light"><span>Commercial winter operations</span> Eastern PA + surrounding regions</p>
            <h1>Winter doesn’t wait.<br /><em>Neither do we.</em></h1>
            <p className="hero__lede">Snow and ice management for commercial properties that cannot afford to slow down.</p>
            <div className="button-row">
              <Link className="button button--signal" href="/quote">Build your snow plan <span aria-hidden="true">↗</span></Link>
              <Link className="button button--outline" href="/services">Explore operations <span aria-hidden="true">→</span></Link>
            </div>
          </div>
          <div className="hero__status">
            <div className="status-head"><span>Operations status</span><strong>Season planning</strong></div>
            <div className="status-row"><span>Coverage</span><strong>PA · NJ · NY · DE</strong></div>
            <div className="status-row"><span>Response</span><strong>24 / 7 events</strong></div>
            <div className="status-row"><span>Operations center</span><strong>Walnutport, PA</strong></div>
            <a href={company.phoneHref}>Speak with operations <span>↗</span></a>
          </div>
        </div>
        <div className="hero__foot">
          <div className="container hero__foot-inner">
            <span>Built for</span>
            {propertyTypes.slice(0, 4).map((type) => <strong key={type}>{type}</strong>)}
          </div>
        </div>
      </section>

      <section className="section services-section">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div><p className="eyebrow">One accountable winter partner</p><h2>Every phase of the storm.<br />One operating system.</h2></div>
            <p>From first forecast through final documentation, every service works as part of a coordinated property plan.</p>
          </div>
          <div className="service-grid">
            {services.map((service, index) => (
              <Link key={service.slug} className={`service-card ${index === 0 ? "service-card--feature" : ""}`} href={`/services/${service.slug}`}>
                <Image src={service.image} alt="" fill sizes={index === 0 ? "100vw" : "(max-width: 760px) 100vw, 50vw"} />
                <div className="service-card__overlay" />
                <div className="service-card__content">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><h3>{service.shortTitle}</h3><p>{service.summary}</p></div>
                  <b aria-hidden="true">↗</b>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark protocol-section">
        <div className="container protocol-grid">
          <div className="protocol-copy">
            <p className="eyebrow eyebrow--light">The ASAI operating protocol</p>
            <h2>Prepared before the first flake.</h2>
            <p>Winter risk is operational risk. We align the people, equipment, materials, forecast intelligence, and communication plan before weather threatens your schedule.</p>
            <Link className="text-link text-link--light" href="/services/risk-management">Explore risk management →</Link>
          </div>
          <div className="protocol-steps">
            {[
              ["01", "Site intelligence", "Entrances, loading areas, shift changes, pedestrian routes, and priority zones mapped in advance."],
              ["02", "Storm readiness", "Equipment, operators, materials, and escalation contacts assigned to the property plan."],
              ["03", "Active command", "Forecast monitoring, field reporting, and roving supervision throughout the winter event."],
              ["04", "Verified closeout", "Post-treatment, completion checks, imagery, and event documentation after conditions stabilize."],
            ].map(([number, title, detail]) => (
              <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{detail}</p></div></article>
            ))}
          </div>
        </div>
      </section>

      <section className="section proof-section">
        <div className="container proof-grid">
          <div className="proof-photo">
            <Image src="/media/operations/snow-hauling.jpg" alt="Loader moving snow into a commercial hauling truck" fill sizes="(max-width: 1050px) 100vw, 50vw" />
            <div className="photo-label"><span>Field operations</span><strong>Scale matched to the property</strong></div>
          </div>
          <div className="proof-copy">
            <p className="eyebrow">Built on four decades of winter work</p>
            <h2>Experience that became a full-time operation.</h2>
            <p>What began as Piechota Brothers plowing in the early 1980s has grown across three generations into a focused commercial snow and property maintenance organization.</p>
            <div className="proof-metrics">
              <div><strong>40+</strong><span>years of snow experience</span></div>
              <div><strong>3</strong><span>generations in the operation</span></div>
              <div><strong>4</strong><span>states in the service region</span></div>
            </div>
            <Link className="button button--dark" href="/about">Meet the company <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="section coverage-section">
        <div className="container coverage-grid">
          <div>
            <p className="eyebrow">Regional reach. Local command.</p>
            <h2>One winter partner across your footprint.</h2>
            <p>Serving eastern Pennsylvania, western New Jersey, southern New York, and northern Delaware—with a partner network built to support growing portfolios.</p>
            <Link className="text-link" href="/service-areas">See the coverage area →</Link>
          </div>
          <div className="coverage-map">
            <span className="map-label map-label--pa">PA</span><span className="map-label map-label--nj">NJ</span><span className="map-label map-label--ny">NY</span><span className="map-label map-label--de">DE</span>
            <div className="map-pulse" /><p>Operations center<br /><strong>Walnutport, PA</strong></p>
          </div>
        </div>
      </section>

      <section className="section credentials-section">
        <div className="container">
          <p className="eyebrow eyebrow--center">Professional standards & affiliations</p>
          <div className="credential-row">
            <Image src="/media/credentials/snowfighters.png" alt="Snowfighters Institute" width={160} height={90} />
            <Image src="/media/credentials/sima.jpg" alt="Snow and Ice Management Association" width={160} height={90} />
            <Image src="/media/credentials/asca.png" alt="Accredited Snow Contractors Association" width={160} height={90} />
            <Image src="/media/credentials/bbb.png" alt="Better Business Bureau Accredited Business" width={160} height={90} />
            <Image src="/media/credentials/chamber.png" alt="Greater Lehigh Valley Chamber of Commerce" width={160} height={90} />
          </div>
        </div>
      </section>

      <section className="section quote-section">
        <div className="container quote-layout">
          <div className="quote-copy">
            <p className="eyebrow eyebrow--light">2026–27 season planning</p>
            <h2>Build a snow plan that works when conditions don’t.</h2>
            <p>Tell us where winter creates pressure for your property. We’ll start with the operation, not a generic price sheet.</p>
            <ul><li>Property-specific site review</li><li>Priority and timing analysis</li><li>Equipment and material planning</li></ul>
          </div>
          <QuoteForm compact />
        </div>
      </section>
    </main>
  );
}
