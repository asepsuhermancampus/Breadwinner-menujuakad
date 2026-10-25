import { getAccounts } from "@/server/identity/runtime";
import { limitAuth } from "@/server/identity/policy";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import {
  assertOrigin,
  readJson,
  reviewJson,
  ReviewHttpError,
  reviewAction,
} from "@/server/reviews/http";
export const runtime = "nodejs";
export function POST(request: Request) {
  return reviewAction(async () => {
    assertOrigin(request);
    const body = (await readJson(request)) as Record<string, unknown>;
    if (
      !body ||
      typeof body.email !== "string" ||
      typeof body.password !== "string" ||
      typeof body.name !== "string" ||
      typeof body.confirmation !== "string" ||
      body.consent !== true
    )
      throw new ReviewHttpError("Lengkapi semua isian dan persetujuan akun.");
    try {
      limitAuth(request, body.email, "register");
      const legacyOwner = getAccounts().emailOwner(body.email),
        legacyDb = getWorkspaceService().db;
      if (
        legacyDb
          .prepare("SELECT 1 FROM workspace_members WHERE account=? LIMIT 1")
          .get(legacyOwner) ||
        legacyDb.prepare("SELECT 1 FROM invoices WHERE owner=? LIMIT 1").get(legacyOwner)
      )
        throw new Error(
          "Gunakan Google untuk akun yang sudah memiliki rencana, lalu tambahkan password dari pengaturan keamanan.",
        );
      getAccounts().register(body.name, body.email, body.password, body.confirmation);
    } catch (error) {
      throw new ReviewHttpError(error instanceof Error ? error.message : "Pendaftaran gagal.");
    }
    return reviewJson({ ok: true }, 201);
  });
}
