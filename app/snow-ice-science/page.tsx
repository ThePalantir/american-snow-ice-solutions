import Image from "next/image";
import Link from "next/link";
import { makeMetadata } from "../seo";

export const metadata = makeMetadata({
  title: "Snow & Ice Science, Brine, and Responsible Materials",
  description: "A practical explanation of pavement temperature, rock salt performance, brine and anti-icing, mechanical removal, and responsible commercial material application.",
  path: "/snow-ice-science",
});

export default function SnowIceSciencePage() {
  return (
    <main>
      <section className="subhero">
        <Image className="subhero__image" src="/media/operations/deicing-full.jpg" alt="Commercial sidewalk and de-icing operation" fill sizes="(max-width: 1050px) 100vw, 64vw" quality={90} priority />
        <div className="subhero__scrim" />
        <div className="container subhero__content"><p className="eyebrow eyebrow--light">Snow &amp; ice science</p><h1>Materials work differently as conditions change.</h1><p>Pavement temperature, timing, precipitation, traffic, and mechanical removal all affect which ice-control approach is appropriate.</p><Link className="button button--signal" href="/quote">Plan your property strategy <span aria-hidden="true">↗</span></Link></div>
      </section>

      <section className="section"><div className="container two-column"><div><p className="eyebrow">Pavement temperature matters</p><h2>Air temperature tells only part of the story.</h2></div><div className="prose-large"><p>Ice-control decisions should account for the surface itself. Sun, shade, wind, traffic, ground temperature, drainage, and the storm’s timing can cause different areas of the same property to behave differently.</p><p>Rock salt must dissolve into a brine to work. That process slows as pavement temperatures fall, so colder conditions may call for different timing, products, rates, or expectations. No deicer removes the need for sound judgment and mechanical snow removal.</p></div></div></section>

      <section className="section section--tint"><div className="container science-comparison"><div><p className="eyebrow">Anti-icing</p><h2>Brine before the bond.</h2><p>When used before a qualifying event, liquid brine can help delay snow and ice bonding to pavement. That can make later mechanical removal more effective and support controlled material application. Brine is not right for every forecast or surface; timing and conditions matter.</p></div><div className="comparison-stack"><article><strong>Before</strong><span>Review pavement conditions, storm timing, precipitation type, and the risk of wash-off.</span></article><article><strong>During</strong><span>Observe actual conditions and adjust the operating plan rather than relying on the forecast alone.</span></article><article><strong>After</strong><span>Inspect for residual moisture, refreeze exposure, drainage, and areas needing follow-up.</span></article></div></div></section>

      <section className="section section--dark"><div className="container"><div className="section-heading section-heading--light"><p className="eyebrow eyebrow--light">Equipment and material stewardship</p><h2>Remove mechanically. Apply deliberately. Document the work.</h2></div><div className="detail-grid detail-grid--dark"><article><h3>Sectional snow pushers</h3><p>Contour-following sections can improve pavement contact and reduce residual snow in appropriate applications, supporting cleaner mechanical removal.</p></article><article><h3>Dedicated sidewalk machines</h3><p>Purpose-built compact equipment supports more consistent pedestrian-route service while reducing dependence on large hand-shoveling crews.</p></article><article><h3>Calibrated application</h3><p>Material selection and application rates should reflect pavement temperature, product guidance, site conditions, and the service objective.</p></article><article><h3>Electric application equipment</h3><p>Electric sprayers and spreaders can reduce small-engine use at the point of application; actual environmental benefit depends on the full operating context.</p></article></div></div></section>

      <section className="section"><div className="container two-column"><div><p className="eyebrow">Claims with context</p><h2>Responsible does not mean risk-free.</h2></div><div className="prose-large"><p>Chloride-based deicers can affect vegetation, soil, water, concrete, metals, and animals when misapplied or overused. Products described as treated, pet-friendlier, or environmentally preferable still require label-compliant storage and application. AS&amp;IS avoids absolute “safe” or “green” claims and focuses on fit-for-condition products, mechanical removal, calibrated equipment, and documented use.</p></div></div></section>

      <section className="cta-band"><div className="container cta-band__inner"><div><p className="eyebrow eyebrow--light">Match the plan to the property</p><h2>Make temperature, traffic, and surface conditions part of discovery.</h2></div><Link className="button button--light" href="/quote">Request a consultation <span aria-hidden="true">↗</span></Link></div></section>
    </main>
  );
}
