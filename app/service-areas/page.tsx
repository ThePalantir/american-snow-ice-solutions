import Link from "next/link";
import { serviceAreas } from "../site-data";
import { makeMetadata } from "../seo";

export const metadata = makeMetadata({ title: "Service Areas", description: "Commercial snow and ice management across eastern Pennsylvania, western New Jersey, southern New York, and northern Delaware.", path: "/service-areas" });

export default function ServiceAreasPage() {
  return (
    <main>
      <section className="page-hero page-hero--map"><div className="container"><p className="eyebrow eyebrow--light">Regional coverage</p><h1>Local command.<br />Multi-state reach.</h1><p>Centered in Walnutport and operating across the region’s most active commercial corridors.</p></div></section>
      <section className="section"><div className="container area-intro"><div><p className="eyebrow">Primary service region</p><h2>Eastern Pennsylvania and the surrounding markets.</h2><p>We currently serve eastern Pennsylvania, western New Jersey, southern New York, and northern Delaware. Coverage continues to grow, so properties just outside the listed area should still contact our team.</p><Link className="button button--signal" href="/quote">Discuss your property <span aria-hidden="true">↗</span></Link></div><div className="coverage-map coverage-map--large"><span className="map-label map-label--pa">PA</span><span className="map-label map-label--nj">NJ</span><span className="map-label map-label--ny">NY</span><span className="map-label map-label--de">DE</span><div className="map-pulse"/><p>Operations center<br/><strong>Walnutport, PA</strong></p></div></div></section>
      <section className="section section--tint"><div className="container"><div className="section-heading"><p className="eyebrow">Communities & corridors</p><h2>Where our teams operate.</h2></div><div className="area-cloud">{serviceAreas.map((area)=><span key={area}>{area}</span>)}</div><p className="area-note">Don’t see your location? Regional and multi-site programs may extend beyond this list.</p></div></section>
      <section className="section partner-callout"><div className="container two-column"><div><p className="eyebrow">Service partner network</p><h2>Strong operators make the network stronger.</h2></div><div><p>We work with qualified regional service partners to support broader coverage and specialized winter capabilities.</p><Link className="button button--secondary" href="/partner-network">Join the network <span aria-hidden="true">→</span></Link></div></div></section>
    </main>
  );
}
