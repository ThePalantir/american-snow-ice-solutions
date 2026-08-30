"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { company, servicesForDisplay } from "../site-data";
import { BrandLogo } from "./BrandLogo";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div className="ops-bar">
        <div className="container ops-bar__inner">
          <span className="ops-bar__planning">Now planning for the <span className="ops-bar__season">2026–27 season</span></span>
          <a href={company.phoneHref} aria-label={`Call American Snow & Ice Solutions at ${company.phone}`}>{company.phone}</a>
        </div>
      </div>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link href="/" className="brand" aria-label="American Snow and Ice Solutions home">
            <BrandLogo priority />
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="primary-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
            <span className="sr-only">Toggle navigation</span>
          </button>
          <nav id="primary-navigation" className={`primary-nav ${open ? "is-open" : ""}`} aria-label="Primary navigation">
            <div className="nav-group">
              <Link href="/services" aria-current={pathname === "/services" ? "page" : undefined} onClick={() => setOpen(false)}>Services</Link>
              <div className="nav-mega">
                {servicesForDisplay.map((service) => (
                  <Link key={service.slug} href={`/services/${service.slug}`} onClick={() => setOpen(false)}>
                    {service.shortTitle}
                  </Link>
                ))}
              </div>
            </div>
            <div className="nav-group">
              <Link href="/winter-risk-plan" aria-current={pathname === "/winter-risk-plan" ? "page" : undefined} onClick={() => setOpen(false)}>Our approach</Link>
              <div className="nav-mega">
                <Link href="/winter-risk-plan" onClick={() => setOpen(false)}>Site-specific planning</Link>
                <Link href="/technology-reporting" onClick={() => setOpen(false)}>Technology &amp; reporting</Link>
                <Link href="/snow-ice-science" onClick={() => setOpen(false)}>Snow &amp; ice science</Link>
                <Link href="/salt-brine" onClick={() => setOpen(false)}>Salt brine &amp; anti-icing</Link>
              </div>
            </div>
            <Link href="/about" aria-current={pathname === "/about" ? "page" : undefined} onClick={() => setOpen(false)}>Company</Link>
            <Link href="/service-areas" aria-current={pathname === "/service-areas" ? "page" : undefined} onClick={() => setOpen(false)}>Coverage</Link>
            <Link href="/quote" className="button button--small button--signal" onClick={() => setOpen(false)}>
              Request a consultation <span aria-hidden="true">↗</span>
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
