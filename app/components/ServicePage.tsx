import Link from "next/link";
import Image from "next/image";
import { Service } from "../site-data";
import { StructuredData } from "./StructuredData";
import { absoluteUrl, siteName, siteUrl } from "../seo";

export function ServicePage({ service }: { service: Service }) {
  return (
    <main>
      <StructuredData
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": `${absoluteUrl(`/services/${service.slug}`)}#service`,
            name: service.title,
            serviceType: service.title,
            description: service.summary,
            url: absoluteUrl(`/services/${service.slug}`),
            image: absoluteUrl(service.image),
            provider: { "@id": `${siteUrl}/#business` },
            areaServed: [
              { "@type": "State", name: "Pennsylvania" },
              { "@type": "State", name: "New Jersey" },
              { "@type": "State", name: "New York" },
              { "@type": "State", name: "Delaware" },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: siteName, item: siteUrl },
              { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/services") },
              { "@type": "ListItem", position: 3, name: service.title, item: absoluteUrl(`/services/${service.slug}`) },
            ],
          },
        ]}
      />
      <section className="subhero subhero--service">
        <Image className="subhero__image" src={service.image} alt={service.imageAlt} fill sizes="(max-width: 1050px) 100vw, 64vw" quality={90} priority />
        <div className="subhero__scrim" />
        <div className="container subhero__content">
          <p className="eyebrow eyebrow--light">{service.eyebrow}</p>
          <h1>{service.title}</h1>
          <p>{service.summary}</p>
          <Link className="button button--signal" href="/quote">Discuss this service <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="section service-intro">
        <div className="container two-column">
          <div>
            <p className="eyebrow">Built around your property</p>
            <h2>A stronger response starts before the forecast.</h2>
          </div>
          <div className="prose-large">
            <p>{service.description}</p>
            <div className="check-list">
              {service.highlights.map((highlight) => <span key={highlight}>{highlight}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <div className="section-heading section-heading--light">
            <p className="eyebrow eyebrow--light">Operational value</p>
            <h2>What this service is designed to deliver.</h2>
          </div>
          <div className="outcome-grid">
            {service.outcomes.map((outcome) => (
              <article key={outcome.label} className="outcome-card">
                <h3>{outcome.label}</h3>
                <p>{outcome.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section process-section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">The operating rhythm</p>
            <h2>One plan. Four accountable phases.</h2>
          </div>
          <div className="process-line">
            {[
              ["1", "Assess", "Walk the property and identify exposure, traffic, and priority zones."],
              ["2", "Prepare", "Assign equipment, materials, crews, triggers, and communication paths."],
              ["3", "Respond", "Monitor the event and execute the property-specific operations plan."],
              ["4", "Document", "Confirm completion, conditions, materials, and post-event needs."],
            ].map(([number, title, detail]) => (
              <article key={number}>
                <span>{number}</span><h3>{title}</h3><p>{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-band__inner">
          <div><p className="eyebrow eyebrow--light">Winter readiness starts now</p><h2>Let’s build the plan before the first warning.</h2></div>
          <Link className="button button--light" href="/quote">Request a risk consultation <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </main>
  );
}
