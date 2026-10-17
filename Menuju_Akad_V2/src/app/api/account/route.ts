export function GET() {
  return Response.json(
    { ok: false, code: "unauthenticated" },
    { status: 401, headers: { "Cache-Control": "private, no-store" } },
  );
}
export function PATCH() {
  return Response.json(
    { ok: false, code: "unauthenticated" },
    { status: 401, headers: { "Cache-Control": "private, no-store" } },
  );
}
