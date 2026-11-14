const actualFetch = globalThis.fetch;
const company = "inbox@company.example";
const companyId = "11111111-2222-4333-8444-555555555555";
const otherId = "22222222-3333-4444-8555-666666666666";
const olderId = "33333333-4444-4555-8666-777777777777";
const unavailableId = "44444444-5555-4666-8777-888888888888";
const companyEmail = {
  id: companyId, from: "Sender <sender@example.com>", to: [`Company <${company.toUpperCase()}>`],
  subject: "Sample company email", created_at: "2026-11-14T13:30:00Z",
};
const otherEmail = {
  id: otherId, from: "other@example.com", to: ["another-business@example.com"],
  subject: "Private to another business", created_at: "2026-11-14T12:30:00Z",
};

globalThis.fetch = async function fetchWithReceivingFixture(input, init) {
  const url = new URL(input instanceof Request ? input.url : input);
  if (url.host !== "api.resend.com") return actualFetch(input, init);
  if ((init?.method ?? "GET") !== "GET"
    || new Headers(init?.headers).get("authorization") !== "Bearer re_fixture_receiving_key") {
    return Response.json({}, { status: 403 });
  }
  if (url.pathname === "/emails/receiving") {
    const after = url.searchParams.get("after");
    const data = after ? [{ ...companyEmail, id: olderId, subject: "Earlier company email" }] : [companyEmail, otherEmail];
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
  if (url.pathname === `/emails/receiving/${unavailableId}`) return Response.json({}, { status: 503 });
  return Response.json({}, { status: 404 });
};
