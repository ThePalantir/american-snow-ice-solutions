import Image from "next/image";
import Link from "next/link";
import { StructuredData } from "../components/StructuredData";
import { absoluteUrl, makeMetadata, siteName, siteUrl } from "../seo";

export const metadata = makeMetadata({
  title: "Salt Brine & Anti-Icing",
  description: "Learn how salt brine supports proactive anti-icing, precise commercial deicing, responsible material use, and professional winter property management.",
  path: "/salt-brine",
});

const brineBenefits = [
  ["Ready to begin working", "Because salt is already dissolved in water, brine can begin acting without first drawing enough moisture from the pavement."],
  ["Precise application", "Calibrated liquid equipment supports consistent placement and application matched to the service plan."],
  ["Material efficiency", "Appropriate pretreatment can potentially reduce unnecessary chloride use while supporting later mechanical removal."],
  ["Efficient anti-icing", "Under suitable forecast and pavement conditions, brine can help reduce bonding before accumulation is established."],
  ["Condition-specific options", "Where properly supported, performance-enhancing additives may extend effectiveness in lower-temperature conditions."],
];

export default function SaltBrinePage() {
  return (
    <main>
      <StructuredData
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${absoluteUrl("/salt-brine")}#webpage`,
            name: "Salt Brine & Anti-Icing",
            description: "How salt brine fits professional commercial snow and ice management.",
            url: absoluteUrl("/salt-brine"),
            isPartOf: { "@id": `${siteUrl}/#website` },
            about: { "@id": `${siteUrl}/#business` },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: siteName, item: siteUrl },
              { "@type": "ListItem", position: 2, name: "Snow & Ice Science", item: absoluteUrl("/snow-ice-science") },
              { "@type": "ListItem", position: 3, name: "Salt Brine & Anti-Icing", item: absoluteUrl("/salt-brine") },
            ],
          },
        ]}
      />

      <section className="subhero subhero--brine">
        <Image className="subhero__image" src="/media/operations/deicing-full.jpg" alt="Commercial snow and ice crew treating a pedestrian route" fill sizes="(max-width: 1050px) 100vw, 64vw" quality={90} priority />
        <div className="subhero__scrim" />
        <div className="container subhero__content">
          <p className="eyebrow eyebrow--light">Professional material strategy</p>
          <h1>Salt Brine &amp; Anti-Icing</h1>
          <p>Salt brine is a sodium-chloride solution used as part of proactive anti-icing strategies. When applied under appropriate conditions, it can help reduce the bond between snow or ice and pavement.</p>
          <Link className="button button--signal" href="/quote">Schedule a snow management consultation <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="section">
        <div className="container two-column">
          <div><p className="eyebrow">What is salt brine?</p><h2>Salt, water, and a proactive operating decision.</h2></div>
          <div className="prose-large">
            <p>Salt brine is rock salt dissolved in water at a controlled concentration. A commercial snow management team can apply it to qualifying pavement before a winter event as an anti-icing treatment.</p>
            <p>Its purpose is not to replace plowing or every other form of commercial deicing. It gives trained personnel another material option when the forecast, pavement temperature, precipitation type, timing, traffic, and property requirements support its use.</p>
            <Link className="text-link" href="/snow-ice-science">Review the larger snow &amp; ice science strategy →</Link>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <div className="section-heading"><p className="eyebrow">Why use brine?</p><h2>More control before snow and ice establish a bond.</h2></div>
          <div className="brine-benefit-grid">
            {brineBenefits.map(([title, detail]) => <article key={title}><h3>{title}</h3><p>{detail}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container brine-control-grid">
          <div><p className="eyebrow eyebrow--light">Produced in-house</p><h2>Material readiness under operational control.</h2></div>
          <div className="prose-large">
            <p>American Snow &amp; Ice Solutions produces salt brine on-site using dedicated brine-making equipment and storage tanks.</p>
            <p>This internal capability supports preparation, material availability, quality-minded operational control, and winter-event readiness without making assumptions about a one-size-fits-all treatment.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-column">
          <div><p className="eyebrow">Lower-temperature performance</p><h2>Additives require the same disciplined judgment.</h2></div>
          <div className="prose-large">
            <p>Properly supported performance-enhancing additives may extend brine effectiveness under lower-temperature conditions. Product selection still depends on manufacturer guidance, pavement conditions, the expected event, and the property plan.</p>
            <p>American Snow &amp; Ice Solutions does not rely on an unverified temperature claim. Crews evaluate the available products and current conditions before selecting an application.</p>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container brine-decision-grid">
          <div>
            <p className="eyebrow">Responsible material use</p>
            <h2>Calibrate the application. Match it to the need.</h2>
            <p>Calibrated brine application can potentially reduce unnecessary chloride use and improve material efficiency. That does not make chloride harmless or appropriate in every circumstance; storage, handling, equipment calibration, surface conditions, and product guidance all matter.</p>
          </div>
          <div>
            <p className="eyebrow">Professional decision making</p>
            <h2>No treatment is used blindly.</h2>
            <div className="decision-formula" aria-label="Professional winter treatment decision inputs">
              <span>Forecast</span><b aria-hidden="true">+</b><span>Pavement conditions</span><b aria-hidden="true">+</b><span>Property needs</span><b aria-hidden="true">+</b><span>Trained personnel</span><b aria-hidden="true">+</b><span>Appropriate materials</span>
            </div>
            <p>The right material, at the right time, is part of professionally managing winter risk for the property. Learn how that carries through our <Link href="/services/deicing-salting">commercial deicing service</Link> and <Link href="/winter-risk-plan">site-specific winter plan</Link>.</p>
          </div>
        </div>
      </section>

      <section className="cta-band"><div className="container cta-band__inner"><div><p className="eyebrow eyebrow--light">Plan materials before the event</p><h2>Build a treatment strategy around your property.</h2></div><Link className="button button--light" href="/quote">Schedule a snow management consultation <span aria-hidden="true">↗</span></Link></div></section>
    </main>
  );
}
