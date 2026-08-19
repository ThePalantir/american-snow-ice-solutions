import Image from "next/image";
import { ScheduleConsultationForm } from "../components/ScheduleConsultationForm";
import { company } from "../site-data";
import { makeMetadata } from "../seo";

export const metadata = makeMetadata({
  title: "Schedule a Snow & Ice Risk Consultation",
  description: "Choose a consultation time and share the operating details needed to begin a site-specific commercial snow and ice risk review.",
  path: "/schedule",
});

export default function SchedulePage() {
  return (
    <main className="form-page">
      <section className="form-hero"><Image className="form-hero__image" src="/media/operations/site-documentation.jpg" alt="Commercial property snow plan review" fill quality={90} sizes="(max-width: 760px) 100vw, 52vw" priority /><div className="form-hero__scrim" /><div className="container form-hero__content"><p className="eyebrow eyebrow--light">Schedule a risk consultation</p><h1>Start with how your property operates.</h1><p>Choose a time, then tell us about shifts, deliveries, access, current contracts, and the winter problems you want corrected.</p></div></section>
      <section className="section"><div className="container form-layout"><aside className="form-aside"><p className="eyebrow">What happens next</p><h2>A focused discovery conversation.</h2>{[["1","Choose a next-day-or-later consultation time."],["2","Share the property’s operating requirements."],["3","Identify service, communication, and documentation gaps."],["4","Prepare for a site-specific winter planning discussion."]].map(([number,detail]) => <div className="aside-step" key={number}><span>{number}</span><p>{detail}</p></div>)}<div className="direct-contact"><span>Prefer to talk now?</span><a href={company.phoneHref}>{company.phone}</a></div></aside><ScheduleConsultationForm /></div></section>
      <section className="integration-note"><div className="container"><strong>Production integration note</strong><p>The date/time rules and discovery questionnaire are implemented. Final Google Calendar booking, staff notifications, confirmation messages, and CRM routing require the business-owned calendar destination, notification recipients, and approved integration method.</p></div></section>
    </main>
  );
}
