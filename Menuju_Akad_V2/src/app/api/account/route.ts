import { auth } from "@/server/auth";
import { GET as getWorkspace, PATCH as patchWorkspace } from "@/app/api/workspace/route";
export async function GET(req: Request) {
  if ((await auth())?.user?.email) return getWorkspace(req);
  return Response.json(
    { ok: false, code: "unauthenticated" },
    { status: 401, headers: { "Cache-Control": "private, no-store" } },
  );
}
export async function PATCH(req: Request) {
  if ((await auth())?.user?.email) return patchWorkspace(req);
  return Response.json(
    { ok: false, code: "unauthenticated" },
    { status: 401, headers: { "Cache-Control": "private, no-store" } },
  );
}
