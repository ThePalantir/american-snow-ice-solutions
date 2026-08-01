"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { company, services } from "../site-data";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="ops-bar">
        <div className="container ops-bar__inner">
          <span><i className="live-dot" /> 24/7 winter event operations</span>
          <span className="ops-bar__planning">Now planning for the 2026–27 season</span>
          <a href={company.phoneHref}>{company.phone}</a>
        </div>
      </div>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link href="/" className="brand" aria-label="American Snow and Ice Solutions home">
            <Image src="/media/brand/asai-logo.png" alt="American Snow & Ice Solutions" width={2048} height={579} priority />
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
              <Link href="/services" onClick={() => setOpen(false)}>Services</Link>
              <div className="nav-mega">
                {services.map((service) => (
                  <Link key={service.slug} href={`/services/${service.slug}`} onClick={() => setOpen(false)}>
                    <span>{service.eyebrow.split(" / ")[0]}</span>
                    {service.shortTitle}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/about" onClick={() => setOpen(false)}>Company</Link>
            <Link href="/service-areas" onClick={() => setOpen(false)}>Coverage</Link>
            <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
            <Link href="/quote" className="button button--small button--signal" onClick={() => setOpen(false)}>
              Build your snow plan <span aria-hidden="true">↗</span>
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
