import { QuoteForm } from "../components/QuoteForm";
import { company } from "../site-data";
import { makeMetadata } from "../seo";

export const metadata = makeMetadata({ title: "Request a Snow & Ice Quote", description: "Request a commercial property review and custom snow and ice management plan.", path: "/quote" });

export default function QuotePage() {
  return (
    <main className="form-page">
      <section className="form-hero"><div className="container"><p className="eyebrow eyebrow--light">Request a site review</p><h1>Tell us where winter puts pressure on your property.</h1><p>We’ll use your priorities to start a practical operations conversation—not a generic price sheet.</p></div></section>
      <section className="section"><div className="container form-layout"><div className="form-aside"><p className="eyebrow">What happens next</p><h2>A clearer path to winter readiness.</h2>{[["01","We review your site and service needs."],["02","An operations specialist follows up."],["03","We assess priorities, timing, and access."],["04","You receive a property-specific plan."]].map(([n,t])=><div className="aside-step" key={n}><span>{n}</span><p>{t}</p></div>)}<div className="direct-contact"><span>Prefer to talk now?</span><a href={company.phoneHref}>{company.phone}</a></div></div><QuoteForm /></div></section>
    </main>
  );
}
