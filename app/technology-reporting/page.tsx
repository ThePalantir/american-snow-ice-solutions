import Image from "next/image";
import Link from "next/link";
import { makeMetadata } from "../seo";

export const metadata = makeMetadata({
  title: "Snow Operations Technology & Reporting",
  description: "How YETI Snow Management, professional winter forecasting, field documentation, and third-party post-event reporting support commercial snow operations.",
  path: "/technology-reporting",
});

const systemLayers = [
  ["Before the event", "Professional forecast information and site-specific operating triggers support mobilization, pretreatment, staffing, and resource decisions."],
  ["During the event", "YETI supports dispatch visibility, service activity, GPS-related records, site photos, field notes, and status communication."],
  ["After the event", "Service history and third-party weather reporting help organize closeout, answer questions, and support review of the event."],
];

export default function TechnologyReportingPage() {
  return (
    <main>
      <section className="subhero">
        <Image className="subhero__image" src="/media/operations/site-documentation.jpg" alt="Field team documenting a commercial snow operation" fill sizes="(max-width: 1050px) 100vw, 64vw" quality={90} priority />
        <div className="subhero__scrim" />
        <div className="container subhero__content"><p className="eyebrow eyebrow--light">Technology &amp; reporting</p><h1>Operational visibility from forecast to closeout.</h1><p>Technology does not replace field judgment. It connects weather intelligence, dispatch, service activity, photos, and post-event records into a more useful operating picture.</p><Link className="button button--signal" href="/quote">Discuss your reporting needs <span aria-hidden="true">↗</span></Link></div>
      </section>

      <section className="section"><div className="container"><div className="section-heading section-heading--split"><div><p className="eyebrow">The information chain</p><h2>Three layers. One event record.</h2></div><p>Each source has a different role. Forecasts support preparation, field systems record work, and post-event reports add independent weather context.</p></div><div className="science-cards">{systemLayers.map(([title,detail])=><article key={title}><h3>{title}</h3><p>{detail}</p></article>)}</div></div></section>

      <section className="section section--dark"><div className="container platform-grid"><div><p className="eyebrow eyebrow--light">YETI Snow Management</p><h2>Purpose-built control for snow operations.</h2><p>YETI’s published capabilities include dispatch, route and crew visibility, service history, site photos, notes, weather conditions, time-on-site information, and client-facing access. AS&amp;IS uses the platform to support field coordination and service documentation.</p><a className="text-link text-link--light" href="https://www.yetisnow.com/" target="_blank" rel="noreferrer">Visit YETI Snow Management →</a></div><div className="platform-list"><div><strong>Dispatch &amp; route status</strong><span>See where work stands across assigned properties.</span></div><div><strong>Site records</strong><span>Connect services, photos, notes, and conditions to the property.</span></div><div><strong>Client visibility</strong><span>Support clearer answers when stakeholders ask what happened and when.</span></div></div></div></section>

      <section className="section"><div className="container partner-evidence"><article><p className="eyebrow">Forecast support</p><h2>The Weather Pros</h2><p>The Weather Pros provides business-focused snow and ice forecasts, storm tracking, alerts, and meteorological insight. AS&amp;IS reports using that service as an operational weather input.</p><a className="text-link" href="https://www.theweatherpros.com/" target="_blank" rel="noreferrer">Review the provider →</a></article><article><p className="eyebrow">Post-event context</p><h2>WeatherWorks</h2><p>WeatherWorks provides professional meteorological services and certified snowfall reporting designed to support post-storm documentation and contract review.</p><a className="text-link" href="https://weatherworksinc.com/" target="_blank" rel="noreferrer">Review the provider →</a></article></div><p className="claim-note">Provider capabilities are verified from current public materials. AS&amp;IS account scope and client access features should be confirmed before launch.</p></section>

      <section className="cta-band"><div className="container cta-band__inner"><div><p className="eyebrow eyebrow--light">Make the record part of the plan</p><h2>Ask what your stakeholders need to see after a storm.</h2></div><Link className="button button--light" href="/quote">Request a consultation <span aria-hidden="true">↗</span></Link></div></section>
    </main>
  );
}
