const actualFetch = globalThis.fetch;
const company = "website-quotes@company.resend.app";
const companyId = "11111111-2222-4333-8444-555555555555";
const otherId = "22222222-3333-4444-8555-666666666666";
const olderId = "33333333-4444-4555-8666-777777777777";
const unavailableId = "44444444-5555-4666-8777-888888888888";
const unrelatedId = "55555555-6666-4777-8888-999999999999";
const submittedId = "66666666-7777-4888-8999-000000000000";
let submitted;
const companyEmail = {
  id: companyId, from: "Sender <sender@example.com>", to: [`Company <${company.toUpperCase()}>`],
  subject: "New ASIS consultation request — Sample company email", created_at: new Date(Date.now()-86400000).toISOString(),
};
const otherEmail = {
  id: otherId, from: "other@example.com", to: ["another-business@example.com"],
  subject: "New ASIS consultation request — Private to another business", created_at: "2026-11-14T12:30:00Z",
};
const unrelated = { ...companyEmail, id: unrelatedId, subject: "Unrelated mail at the quote address" };

globalThis.fetch = async function fetchWithReceivingFixture(input, init) {
  const url = new URL(input instanceof Request ? input.url : input);
  if (url.host !== "api.resend.com") return actualFetch(input, init);
  if (url.pathname === "/emails" && init?.method === "POST"
    && new Headers(init.headers).get("authorization") === "Bearer re_fixture_sending_key") {
    const { from, to, subject, text, html, headers } = JSON.parse(init.body);
    if (to[0] !== company) return Response.json({ id: "fixture-primary-send" });
    submitted = { id: submittedId, created_at: new Date().toISOString(), from, to, subject, text, html, headers };
    return Response.json({ id: "fixture-copy-send" });
  }
  if ((init?.method ?? "GET") !== "GET"
    || new Headers(init?.headers).get("authorization") !== "Bearer re_fixture_receiving_key") {
    return Response.json({}, { status: 403 });
  }
  if (process.env.FIXTURE_RECEIVING_OFFLINE === "1") return Response.json({}, { status: 503 });
  if (url.pathname === "/emails/receiving") {
    const after = url.searchParams.get("after");
    const data = after ? [{ ...companyEmail, id: olderId, subject: "New ASIS consultation request — Earlier company email" }]
      : [submitted, companyEmail, unrelated, otherEmail].filter(Boolean);
    return Response.json({ data, has_more: !after });
  }
  if (url.pathname === `/emails/receiving/${companyId}` && url.searchParams.get("html_format") === "cid") {
    return Response.json({
      ...companyEmail,
      text: null,
      html: '<p>Message &amp; details</p><img src="https://example.com/pixel"><script>maliciousScript</script><a href="https://example.com/unsafe">Link label</a>',
      attachments: [{ id: "attachment-1", filename: "estimate.pdf" }],
    });
  }
  if (url.pathname === `/emails/receiving/${otherId}`) return Response.json({ ...otherEmail, text: "Other business message body" });
  if (url.pathname === `/emails/receiving/${unrelatedId}`) return Response.json({ ...unrelated, text: "Unrelated message body" });
  if (url.pathname === `/emails/receiving/${olderId}`) return Response.json({ ...companyEmail, id: olderId, subject: "New ASIS consultation request — Earlier company email", created_at: new Date(Date.now()-10*86400000).toISOString(), text: "Saved older inquiry" });
  if (url.pathname === `/emails/receiving/${submittedId}` && submitted) return Response.json(submitted);
  if (url.pathname === `/emails/receiving/${unavailableId}`) return Response.json({}, { status: 503 });
  return Response.json({}, { status: 404 });
};
