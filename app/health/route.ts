export function GET() {
  return Response.json({
    service: "american-snow-ice-solutions",
    status: "ok",
    buildSha: process.env.ASIS_BUILD_SHA ?? "unknown",
  }, { headers: { "Cache-Control": "no-store" } });
}
