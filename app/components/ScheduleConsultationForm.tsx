"use client";

import { FormEvent, useMemo, useState } from "react";

const timeOptions = Array.from({ length: 21 }, (_, index) => {
  const minutes = 8 * 60 + index * 30;
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  const labelHour = hour > 12 ? hour - 12 : hour;
  const suffix = hour >= 12 ? "p.m." : "a.m.";
  return { value, label: `${labelHour}:${String(minute).padStart(2, "0")} ${suffix}` };
});

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function ScheduleConsultationForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [leadTimeThreshold] = useState(() => Date.now() + 24 * 60 * 60 * 1000);

  const minimumDate = useMemo(() => {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    return formatDateInput(nextDay);
  }, []);

  const maximumDate = useMemo(() => {
    const future = new Date();
    future.setDate(future.getDate() + 180);
    return formatDateInput(future);
  }, []);

  const availableTimeOptions = useMemo(() => {
    if (!date) return timeOptions;

    return timeOptions.filter((option) => new Date(`${date}T${option.value}:00`).getTime() >= leadTimeThreshold);
  }, [date, leadTimeThreshold]);

  function continueToDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStep(2);
  }

  function prepareRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStep(3);
  }

  if (step === 3) {
    return (
      <div className="schedule-success" role="status">
        <span>Consultation request prepared</span>
        <h2>Your property review is ready for routing.</h2>
        <p>
          The requested appointment is <strong>{date}</strong> at <strong>{time}</strong>. This review build does not transmit personal information. Production delivery will be enabled when the business-owned Google Calendar and notification workflow are connected.
        </p>
        <button className="text-link" type="button" onClick={() => setStep(1)}>Prepare another request →</button>
      </div>
    );
  }

  return (
    <div className="schedule-panel">
      <div className="schedule-progress" aria-label={`Step ${step} of 2`}>
        <span className={step >= 1 ? "is-active" : ""}>1. Select a time</span>
        <span className={step >= 2 ? "is-active" : ""}>2. Property details</span>
      </div>

      {step === 1 ? (
        <form className="schedule-form" onSubmit={continueToDetails}>
          <div className="field-grid">
            <label>
              <span>Preferred date</span>
              <input type="date" name="date" min={minimumDate} max={maximumDate} value={date} onChange={(event) => { setDate(event.target.value); setTime(""); }} required />
            </label>
            <label>
              <span>Preferred time</span>
              <select name="time" value={time} onChange={(event) => setTime(event.target.value)} required>
                <option value="" disabled>Select a time</option>
                {availableTimeOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
              </select>
            </label>
          </div>
          {date && availableTimeOptions.length === 0 && <p className="form-alert" role="alert">No times on this date meet the 24-hour lead requirement. Please select the following day.</p>}
          <p className="form-note form-note--left">Appointments are available at least 24 hours in advance, from 8:00 a.m. through 6:00 p.m.</p>
          <button className="button button--signal button--wide" type="submit">Continue to property details <span aria-hidden="true">→</span></button>
        </form>
      ) : (
        <form className="schedule-form" onSubmit={prepareRequest}>
          <div className="schedule-selection">
            <span>Requested consultation</span>
            <strong>{date} at {time}</strong>
            <button type="button" onClick={() => setStep(1)}>Change</button>
          </div>
          <div className="field-grid">
            <label><span>Name</span><input name="name" autoComplete="name" required /></label>
            <label><span>Work email</span><input type="email" name="email" autoComplete="email" required /></label>
            <label><span>Company name</span><input name="company" autoComplete="organization" required /></label>
            <label><span>Phone</span><input type="tel" name="phone" autoComplete="tel" required /></label>
            <label className="field-span"><span>Company / property address</span><input name="address" autoComplete="street-address" required /></label>
            <label className="field-span"><span>Hours of operation, shifts, and delivery windows</span><textarea name="hours" rows={3} required /></label>
            <fieldset className="field-span choice-field">
              <legend>Have you worked with a snow professional to build a site-specific snow plan?</legend>
              <label><input type="radio" name="snowPlan" value="yes" required /> Yes</label>
              <label><input type="radio" name="snowPlan" value="no" required /> No</label>
            </fieldset>
            <fieldset className="field-span choice-field">
              <legend>Are you currently under a snow contract?</legend>
              <label><input type="radio" name="contract" value="yes" required /> Yes</label>
              <label><input type="radio" name="contract" value="no" required /> No</label>
            </fieldset>
            <fieldset className="field-span choice-field">
              <legend>Do you have an active RFP or are you seeking proposals?</legend>
              <label><input type="radio" name="rfp" value="yes" required /> Yes</label>
              <label><input type="radio" name="rfp" value="no" required /> No</label>
            </fieldset>
            <label className="field-span"><span>Top winter-service challenges from recent seasons</span><textarea name="challenges" rows={5} placeholder="Tell us where service, communication, timing, access, or documentation has fallen short." required /></label>
          </div>
          <button className="button button--signal button--wide" type="submit">Prepare consultation request <span aria-hidden="true">↗</span></button>
          <p className="form-note">Your information will be used only to prepare and follow up on this property consultation.</p>
        </form>
      )}
    </div>
  );
}
