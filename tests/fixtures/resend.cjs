const actualFetch = globalThis.fetch;
const inbox = "website-quotes@company.resend.app";
const forgedEmail = {
  id: "11111111-2222-4333-8444-555555555555",
  from: "website@example.com",
  to: [inbox],
  subject: "New ASIS consultation request — Forged inquiry",
  created_at: new Date().toISOString(),
  text: "Unverified email sent straight to the receiving address",
};

globalThis.fetch = async function fetchWithResendFixture(input, init) {
  const url = new URL(input instanceof Request ? input.url : input);
  if (url.host !== "api.resend.com") return actualFetch(input, init);

  if (url.pathname === "/emails" && init?.method === "POST"
    && new Headers(init.headers).get("authorization") === "Bearer re_fixture_sending_key") {
    const { to } = JSON.parse(init.body);
    if (to[0] === "Piechotagrpinc@gmail.com") return Response.json({ id: "fixture-primary-send" });
    if (to[0] === inbox) return Response.json({ id: "fixture-copy-send" });
  }
  if (url.pathname === "/emails/receiving") return Response.json({ data: [forgedEmail], has_more: false });
  if (url.pathname === `/emails/receiving/${forgedEmail.id}`) return Response.json(forgedEmail);
  return Response.json({}, { status: 403 });
};
