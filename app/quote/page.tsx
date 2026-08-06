import Image from "next/image";
import { QuoteForm } from "../components/QuoteForm";
import { company } from "../site-data";
import { makeMetadata } from "../seo";

export const metadata = makeMetadata({ title: "Request a Snow & Ice Quote", description: "Request a commercial property review and custom snow and ice management plan.", path: "/quote" });

export default function QuotePage() {
  return (
    <main className="form-page">
      <section className="form-hero"><Image className="form-hero__image" src="/media/operations/site-documentation.jpg" alt="Commercial lot snow removal equipment working on site" fill quality={90} sizes="(max-width: 760px) 100vw, 52vw" priority/><div className="form-hero__scrim"/><div className="container form-hero__content"><p className="eyebrow eyebrow--light">Request a site review</p><h1>Tell us where winter puts pressure on your property.</h1><p>We’ll use your priorities to start a practical operations conversation—not a generic price sheet.</p></div></section>
      <section className="section"><div className="container form-layout"><div className="form-aside"><p className="eyebrow">What happens next</p><h2>A clearer path to winter readiness.</h2>{[["1","We review your site and service needs."],["2","An operations specialist follows up."],["3","We assess priorities, timing, and access."],["4","You receive a property-specific plan."]].map(([n,t])=><div className="aside-step" key={n}><span>{n}</span><p>{t}</p></div>)}<div className="direct-contact"><span>Prefer to talk now?</span><a href={company.phoneHref}>{company.phone}</a></div></div><QuoteForm /></div></section>
    </main>
  );
}
