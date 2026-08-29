import Link from "next/link";
import Image from "next/image";
import { makeMetadata } from "../seo";

export const metadata = makeMetadata({ title: "Service Partner Network", description: "Join the American Snow & Ice Solutions regional service partner network.", path: "/partner-network" });

export default function PartnerNetworkPage() {
  return (
    <main>
      <section className="subhero"><Image className="subhero__image" src="/media/operations/sidewalk-equipment.jpg" alt="Specialized commercial sidewalk snow equipment" fill sizes="(max-width: 1050px) 100vw, 64vw" quality={90} priority/><div className="subhero__scrim"/><div className="container subhero__content"><p className="eyebrow eyebrow--light">Service partner network</p><h1>Built with capable operators.</h1><p>Join a regional network focused on accountable commercial winter service.</p></div></section>
      <section className="section"><div className="container two-column"><div><p className="eyebrow">Grow the network</p><h2>Bring your equipment, experience, and service area.</h2></div><div className="prose-large"><p>American Snow & Ice Solutions works with established contractors across the region. We’re interested in dependable partners with commercial snow experience, well-maintained equipment, clear communication, and strong local coverage.</p><div className="check-list"><span>Commercial plowing capability</span><span>Sidewalk and de-icing services</span><span>Reliable event communication</span><span>Documented service areas and equipment</span></div><Link className="button button--signal" href="mailto:info@americansnowandice.com?subject=Service%20Partner%20Network">Introduce your company <span aria-hidden="true">↗</span></Link></div></div></section>
    </main>
  );
}
