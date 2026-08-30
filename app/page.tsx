import Image from "next/image";
import Link from "next/link";
import { WeatherWidget } from "./components/WeatherWidget";
import { company, servicesForDisplay } from "./site-data";
import { makeMetadata } from "./seo";

export const metadata = makeMetadata({
  title: "Professional Winter Risk Management",
  description: "Site-specific commercial snow and ice management planning, weather intelligence, documented operations, and winter risk support across Eastern Pennsylvania and surrounding regions.",
  path: "/",
});

const operatingQuestions = [
  ["Operating hours", "When must entrances, parking fields, and pedestrian routes be ready?"],
  ["Shift changes", "When do employee and visitor volumes create the greatest exposure?"],
  ["Deliveries", "Which docks, lanes, gates, and circulation paths cannot be interrupted?"],
  ["Priority zones", "Where would a delay have the highest operational consequence?"],
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero__visual">
          <Image className="hero__image" src="/media/operations/hero-snow-removal.jpg" alt="Commercial snow operations clearing an active property" fill sizes="(max-width: 760px) 100vw, (max-width: 1050px) 70vw, 63vw" quality={90} priority />
          <div className="hero__atmosphere" aria-hidden="true" />
        </div>
        <div className="hero__overlay" aria-hidden="true" />
        <div className="container hero__content">
          <div className="hero__copy">
            <p className="eyebrow eyebrow--light major-section-label">Professional snow &amp; ice management</p>
            <h1>We professionally manage <em>winter risk</em> for your property.</h1>
            <p className="hero__lede">Site-specific planning, professional weather intelligence, accountable field operations, and documented closeout, all built around how your property actually works.</p>
            <div className="button-row">
              <Link className="button button--signal" href="/quote">Request a risk consultation <span aria-hidden="true">↗</span></Link>
              <a className="button button--outline" href={company.phoneHref}>Call {company.phone}</a>
            </div>
          </div>
        </div>
        <div className="hero__foot">
          <div className="container hero__foot-inner">
            <strong className="supporting-proof">40+ years of winter experience</strong>
            <strong className="supporting-proof">Property-specific snow plans</strong>
            <strong className="supporting-proof">Professional forecast inputs</strong>
            <strong className="supporting-proof">GPS + photo documentation</strong>
          </div>
        </div>
      </section>

      <section className="section planning-section">
        <div className="container planning-grid">
          <div className="planning-copy">
            <p className="eyebrow major-section-label">Learn the business</p>
            <h2>We learn your business before we build your snow plan.</h2>
            <p>A useful snow plan begins with business questions, not a generic price sheet. We map the property around the people, movement, timing, and access points that matter most.</p>
            <p className="planning-promise">We take the stress out of winter.</p>
            <Link className="text-link" href="/winter-risk-plan">See how a site-specific plan is built →</Link>
          </div>
          <div className="question-grid">
            {operatingQuestions.map(([title, detail]) => (
              <article key={title}><h3>{title}</h3><p>{detail}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="section services-section section--tint">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div><p className="eyebrow major-section-label">One accountable winter partner</p><h2>A management system, not isolated services.</h2></div>
            <p>Every operating discipline supports one property plan, from the first risk review through the final event record.</p>
          </div>
          <div className="service-grid">
            {servicesForDisplay.map((service, index) => (
              <Link key={service.slug} className={`service-card ${index === 0 ? "service-card--feature" : ""}`} href={`/services/${service.slug}`}>
                <Image src={service.image} alt="" fill quality={90} sizes={index === 0 ? "(max-width: 760px) calc(100vw - 28px), (max-width: 1280px) calc(100vw - 40px), 1240px" : "(max-width: 760px) calc(100vw - 28px), (max-width: 1280px) calc((100vw - 56px) / 2), 612px"} />
                <div className="service-card__overlay" />
                <div className="service-card__content"><div><h3>{service.shortTitle}</h3><p>{service.summary}</p></div><b aria-hidden="true">↗</b></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark protocol-section">
        <div className="container protocol-grid">
          <div className="protocol-copy">
            <p className="eyebrow eyebrow--light major-section-label">The AS&amp;IS operating protocol</p>
            <h2>Prepared before the first flake.</h2>
            <p>Winter exposure is operational exposure. People, equipment, materials, forecast intelligence, decision triggers, and communication paths are aligned before conditions threaten your schedule.</p>
            <Link className="text-link text-link--light" href="/winter-risk-plan">Explore the winter risk plan →</Link>
          </div>
          <div className="protocol-steps">
            {[
              ["1", "Assess the property", "Document entrances, lots, loading areas, shift changes, pedestrian routes, drainage, and priority zones."],
              ["2", "Engineer the response", "Assign equipment, operators, materials, service triggers, escalation contacts, and completion standards."],
              ["3", "Command the event", "Monitor professional forecasts and field conditions while crews, supervisors, and property contacts stay connected."],
              ["4", "Verify the work", "Capture service activity, conditions, imagery, materials, and post-event needs for a clearer event record."],
            ].map(([number, title, detail]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{detail}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="section intelligence-section">
        <div className="container intelligence-grid">
          <div className="intelligence-visual">
            <Image src="/media/operations/site-documentation.jpg" alt="Snow operations team documenting conditions at a commercial property" fill quality={90} sizes="(max-width: 1050px) calc(100vw - 40px), 48vw" />
            <div className="photo-label"><span>Operational visibility</span><strong className="supporting-proof">Field activity connected to the event record</strong></div>
          </div>
          <div className="intelligence-copy">
            <p className="eyebrow major-section-label">Technology &amp; reporting</p>
            <h2>Better decisions before, during, and after the storm.</h2>
            <p>AS&amp;IS uses purpose-built operational software, professional forecast support, and post-event weather reporting to create a clearer picture of what was expected, what crews encountered, and what work was completed.</p>
            <div className="intelligence-list">
              <div><strong className="supporting-proof">YETI Snow Management</strong><span>Dispatch, GPS-supported activity, site photos, service history, and client visibility.</span></div>
              <div><strong className="supporting-proof">The Weather Pros</strong><span>Business-focused winter forecasting and storm intelligence for operational planning.</span></div>
              <div><strong className="supporting-proof">WeatherWorks</strong><span>Third-party post-event snowfall and weather documentation.</span></div>
            </div>
            <Link className="button button--secondary" href="/technology-reporting">See the reporting system <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="section science-section section--tint">
        <div className="container">
          <div className="section-heading section-heading--split"><div><p className="eyebrow major-section-label">Snow &amp; ice science</p><h2>The temperature changes the strategy.</h2></div><p>Effective ice management depends on pavement temperature, precipitation type, timing, traffic, product choice, and application method, not one material used the same way in every storm.</p></div>
          <div className="science-cards">
            <article><h3>Why salt slows down</h3><p>Rock salt needs moisture to form a working brine. As pavement temperatures fall, the process becomes slower and less effective, requiring a different operational decision.</p></article>
            <article><h3>Where brine fits</h3><p>When conditions allow, liquid anti-icing can be applied before a storm to help delay bonding and support more controlled material use.</p></article>
            <article><h3>Responsible application</h3><p>Calibrated equipment, appropriate products, mechanical removal, and documented application rates help balance surface needs with material stewardship.</p></article>
          </div>
          <div className="science-links">
            <Link className="text-link" href="/snow-ice-science">Understand the science and materials →</Link>
            <Link className="text-link" href="/salt-brine">Explore salt brine &amp; anti-icing →</Link>
          </div>
        </div>
      </section>

      <section className="section credentials-section">
        <div className="container">
          <div className="section-heading credential-heading"><p className="eyebrow major-section-label">Credentials &amp; affiliations</p><h2>Training, standards, and specialized resources support the work.</h2></div>
          <div className="credential-row credential-row--six">
            <div><Image src="/media/credentials/asca-logo.png" alt="Accredited Snow Contractors Association logo" width={403} height={241} /></div>
            <div><Image className="credential-logo--tall" src="/media/credentials/bbb-logo.svg" alt="Better Business Bureau logo" width={562} height={961} /></div>
            <div><Image className="credential-logo--wide" src="/media/credentials/chamber-logo.png" alt="Greater Lehigh Valley Chamber of Commerce logo" width={1504} height={410} /></div>
            <div><Image className="credential-logo--wide" src="/media/credentials/sima-logo.webp" alt="Snow and Ice Management Association logo" width={400} height={161} /></div>
            <div><Image className="credential-logo--tall" src="/media/credentials/snowfighters-logo.png" alt="Snowfighters Institute logo" width={1000} height={1000} /></div>
            <div><Image className="credential-logo--wide" src="/media/credentials/weather-pros-logo.png" alt="The Weather Pros logo" width={639} height={312} /></div>
          </div>
        </div>
      </section>

      <section className="home-weather-section" aria-labelledby="local-weather-heading">
        <div className="container home-weather-grid">
          <div><p className="eyebrow eyebrow--light major-section-label">Local conditions</p><h2 id="local-weather-heading">Lehigh Valley weather</h2></div>
          <WeatherWidget />
        </div>
      </section>

      <section className="section consultation-section">
        <div className="container consultation-grid">
          <div><p className="eyebrow eyebrow--light major-section-label">Plan before the season</p><h2>Start with a conversation about the property, not a generic quote.</h2></div>
          <div><p>Tell us how your site operates and identify the winter problems you want corrected. That gives the operations team a stronger starting point for discovery and follow-up.</p><Link className="button button--signal" href="/quote">Request a snow &amp; ice risk consultation <span aria-hidden="true">↗</span></Link></div>
        </div>
      </section>
    </main>
  );
}
