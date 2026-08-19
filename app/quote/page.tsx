import Image from "next/image";
import { QuoteForm } from "../components/QuoteForm";
import { company } from "../site-data";
import { makeMetadata } from "../seo";

export const metadata = makeMetadata({
  title: "Request a Winter Risk Consultation",
  description: "Request a conversation about a site-specific commercial snow and ice management plan.",
  path: "/quote",
});

export default function QuotePage() {
  return (
    <main className="form-page">
      <section className="form-hero"><Image className="form-hero__image" src="/media/operations/site-documentation.jpg" alt="Commercial property snow plan review" fill quality={90} sizes="(max-width: 760px) 100vw, 52vw" priority /><div className="form-hero__scrim" /><div className="container form-hero__content"><p className="eyebrow eyebrow--light">Request a winter risk consultation</p><h1>Start with how your property operates.</h1><p>Tell us about shifts, deliveries, access, priority areas, and the winter problems you want corrected. The operations team will follow up to arrange a conversation.</p></div></section>
      <section className="section"><div className="container form-layout"><aside className="form-aside"><p className="eyebrow">What happens next</p><h2>A focused discovery conversation.</h2>{[["1","Share the property’s operating requirements."],["2","Identify service, communication, and documentation gaps."],["3","An operations specialist reviews the request."],["4","The team contacts you to arrange the consultation."]].map(([number,detail]) => <div className="aside-step" key={number}><span>{number}</span><p>{detail}</p></div>)}<div className="direct-contact"><span>Prefer to talk now?</span><a href={company.phoneHref}>{company.phone}</a></div></aside><QuoteForm /></div></section>
    </main>
  );
}
