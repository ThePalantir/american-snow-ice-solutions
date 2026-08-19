import Link from "next/link";
import Image from "next/image";
import { servicesForDisplay } from "../site-data";
import { makeMetadata } from "../seo";

export const metadata = makeMetadata({ title: "Commercial Snow & Ice Services", description: "Coordinated commercial plowing, de-icing, sidewalk clearing, weather reporting, and winter risk management.", path: "/services" });

export default function ServicesPage() {
  return (
    <main>
      <section className="subhero subhero--overview">
        <Image className="subhero__image" src="/media/operations/risk-management.jpg" alt="Plow truck working through an active winter storm" fill sizes="(max-width: 1050px) 100vw, 64vw" quality={90} priority />
        <div className="subhero__scrim" />
        <div className="container subhero__content"><p className="eyebrow eyebrow--light">Commercial winter operations</p><h1>Complete snow & ice management.</h1><p>Five coordinated disciplines. One accountable property plan.</p></div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading section-heading--split"><div><p className="eyebrow">The operating stack</p><h2>Coverage from forecast to closeout.</h2></div><p>Each service can stand alone, but the strongest winter program connects them into one clear response protocol.</p></div>
          <div className="service-list">
            {servicesForDisplay.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`} className="service-list__item">
                <Image src={service.image} alt="" width={460} height={300} quality={85} sizes="(max-width: 760px) calc(100vw - 28px), 230px" />
                <div><p>{service.eyebrow}</p><h2>{service.title}</h2><strong>{service.summary}</strong></div>
                <b aria-hidden="true">↗</b>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="cta-band"><div className="container cta-band__inner"><div><p className="eyebrow eyebrow--light">Your property. Your priorities.</p><h2>Start with an operating conversation.</h2></div><Link className="button button--light" href="/schedule">Schedule a risk consultation <span>↗</span></Link></div></section>
    </main>
  );
}
