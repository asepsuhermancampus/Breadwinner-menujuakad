import { getSuperadminSession } from "@/server/reviews/access";
import { getAccounts } from "@/server/identity/runtime";
import { listAccountDirectory } from "@/server/identity/account-directory";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET(request: Request) {
  const headers = { "Cache-Control": "private, no-store" };
  if (!(await getSuperadminSession()))
    return Response.json({ error: "Silakan masuk sebagai superadmin." }, { status: 401, headers });
  try {
    const params = new URL(request.url).searchParams;
    return Response.json(
      listAccountDirectory(
        getAccounts().db,
        params.get("q") ?? "",
        Number(params.get("page") ?? "1"),
      ),
      { headers },
    );
  } catch {
    return Response.json({ error: "Daftar akun belum dapat dimuat." }, { status: 503, headers });
  }
}
