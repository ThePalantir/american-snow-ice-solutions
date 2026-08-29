import Link from "next/link";
import Image from "next/image";
import { makeMetadata } from "../seo";

export const metadata = makeMetadata({ title: "Our Company", description: "Three generations and more than four decades of snow and ice operations experience.", path: "/about" });

export default function AboutPage() {
  return (
    <main>
      <section className="subhero subhero--about">
        <Image className="subhero__image" src="/media/operations/company-history.jpg" alt="American Property Solutions truck and snow equipment" fill sizes="(max-width: 1050px) 100vw, 64vw" quality={90} priority />
        <div className="subhero__scrim" /><div className="container subhero__content"><p className="eyebrow eyebrow--light">Built through winters</p><h1>Three generations.<br />One operating standard.</h1><p>A family operation shaped by more than four decades of snow work.</p></div>
      </section>
      <section className="section"><div className="container story-grid"><div><p className="eyebrow">The Piechota story</p><h2>From a Bethlehem garage to regional winter operations.</h2></div><div className="prose-large"><p>Greg and Mark Piechota opened a small auto repair garage in Bethlehem in 1975. By the early 1980s, snow plowing had become part of the family’s winter work. The operation expanded steadily—adding accounts, trucks, Bobcat loaders, and deeper commercial capabilities.</p><p>Michael Piechota joined as a second-generation snowplow operator in 1991. The family committed more fully to commercial snow removal in 1998, and welcomed the third generation in 2016. Today, the organization focuses year-round on property maintenance, with snow and ice management at the center of its operations.</p></div></div></section>
      <section className="section section--dark"><div className="container"><div className="section-heading section-heading--light"><p className="eyebrow eyebrow--light">The timeline</p><h2>Experience compounded season after season.</h2></div><div className="timeline">
        {[["1975","Piechota Brothers opens in Bethlehem."],["1980s","Commercial plowing becomes a growing winter operation."],["1991","The second generation joins the snow team."],["1998","Loaders and expanded commercial capabilities are added."],["2016","The third generation enters the family operation."],["Today","A focused regional snow and property maintenance company."]].map(([year,detail])=><article key={year}><strong>{year}</strong><span>{detail}</span></article>)}
      </div></div></section>
      <section className="section"><div className="container values-grid"><div><p className="eyebrow">How we operate</p><h2>The work is measured in readiness.</h2></div><div className="value-cards">{[["Plan the property","Know the site, pressure points, and business priorities before the season."],["Stay reachable","Keep operations and clients connected when conditions change."],["Document the event","Pair field work with weather, location, condition, and completion records."],["Invest in capability","Use modern equipment and specialized tools to improve safety and efficiency."]].map(([title,detail])=><article key={title}><h3>{title}</h3><p>{detail}</p></article>)}</div></div></section>
      <section className="cta-band"><div className="container cta-band__inner"><div><p className="eyebrow eyebrow--light">Put experience to work</p><h2>Make your property winter-ready.</h2></div><Link className="button button--light" href="/quote">Request a consultation <span aria-hidden="true">↗</span></Link></div></section>
    </main>
  );
}
