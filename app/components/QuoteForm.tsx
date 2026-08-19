"use client";

import { FormEvent, useState } from "react";

export function QuoteForm({ compact = false }: { compact?: boolean }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="form-success" role="status">
        <span>Request prepared</span>
        <h3>Your property is on our radar.</h3>
        <p>This proof-of-concept keeps submissions local. In production, this request will route directly to the operations team.</p>
        <button className="text-link" type="button" onClick={() => setSubmitted(false)}>Send another request →</button>
      </div>
    );
  }

  return (
    <form className={`quote-form ${compact ? "quote-form--compact" : ""}`} onSubmit={handleSubmit}>
      <div className="field-grid">
        <label>
          <span>Company name</span>
          <input name="company" autoComplete="organization" required placeholder="Your organization" />
        </label>
        <label>
          <span>Primary contact</span>
          <input name="name" autoComplete="name" required placeholder="Full name" />
        </label>
        <label>
          <span>Work email</span>
          <input type="email" name="email" autoComplete="email" required placeholder="name@company.com" />
        </label>
        <label>
          <span>Phone</span>
          <input type="tel" name="phone" autoComplete="tel" required placeholder="(610) 000-0000" />
        </label>
        {!compact && (
          <>
            <label className="field-span">
              <span>Property address or portfolio area</span>
              <input name="location" autoComplete="street-address" required placeholder="Street, city, state or service region" />
            </label>
            <label>
              <span>Property type</span>
              <select name="propertyType" defaultValue="">
                <option value="" disabled>Select a property type</option>
                <option>Industrial / warehouse</option>
                <option>Retail / shopping center</option>
                <option>Medical / healthcare</option>
                <option>Office / corporate campus</option>
                <option>Multi-site portfolio</option>
                <option>Other commercial property</option>
              </select>
            </label>
            <label>
              <span>Services needed</span>
              <select name="service" defaultValue="">
                <option value="" disabled>Select primary need</option>
                <option>Full snow & ice management</option>
                <option>Commercial plowing</option>
                <option>De-icing & salting</option>
                <option>Sidewalks & walkways</option>
                <option>Multi-site service partner</option>
              </select>
            </label>
            <label className="field-span">
              <span>Tell us about the property</span>
              <textarea name="details" rows={5} placeholder="Share site size, operating hours, priority areas, or current winter challenges." />
            </label>
          </>
        )}
      </div>
      <button className="button button--signal button--wide" type="submit">
        Request a risk consultation <span aria-hidden="true">↗</span>
      </button>
      <p className="form-note">An operations specialist will review your needs and follow up directly.</p>
    </form>
  );
}
