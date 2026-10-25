import { randomBytes } from "node:crypto";
import { auth } from "@/server/auth";
import { getAccounts } from "@/server/identity/runtime";
import { passwordHash, passwordMatches } from "@/server/identity/accounts";
import { limitAuth } from "@/server/identity/policy";
import {
  assertOrigin,
  readJson,
  reviewJson,
  ReviewHttpError,
  reviewAction,
} from "@/server/reviews/http";
export const runtime = "nodejs";
export function GET() {
  return reviewAction(async () => {
    const session = await auth();
    const account = session?.user?.id ? getAccounts().byId(session.user.id) : null;
    if (!account) throw new ReviewHttpError("Silakan masuk kembali.", 401);
    return reviewJson({
      hasPassword: Boolean(account.password_hash),
      googleLinked: Boolean(
        getAccounts().db.prepare("SELECT 1 FROM identities WHERE account_id=?").get(account.id),
      ),
    });
  });
}
export function POST(request: Request) {
  return reviewAction(async () => {
    assertOrigin(request);
    const session = await auth(),
      accounts = getAccounts();
    const account = session?.user?.id ? accounts.byId(session.user.id) : null;
    if (!account || !session) throw new ReviewHttpError("Silakan masuk kembali.", 401);
    limitAuth(request, account.email, "login");
    const body = (await readJson(request)) as Record<string, unknown>;
    if (!body) throw new ReviewHttpError("Data tidak lengkap.");
    if (body.action === "link") {
      const token = randomBytes(32).toString("hex");
      accounts.db
        .prepare("DELETE FROM account_links WHERE expires<=? OR account_id=?")
        .run(Date.now(), account.id);
      accounts.db
        .prepare("INSERT INTO account_links VALUES (?,?,?)")
        .run(accounts.emailOwner(token), account.id, Date.now() + 600000);
      const response = reviewJson({ ok: true });
      response.cookies.set("ma_google_link", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: new URL(request.url).protocol === "https:",
        maxAge: 600,
      });
      return response;
    }
    if (
      typeof body.password !== "string" ||
      body.password.length < 12 ||
      body.password.length > 128 ||
      body.password !== body.confirmation
    )
      throw new ReviewHttpError("Password harus 12–128 karakter dan konfirmasi harus sama.");
    if (account.password_hash) {
      if (
        typeof body.currentPassword !== "string" ||
        body.currentPassword.length > 128 ||
        !passwordMatches(body.currentPassword, account.password_hash)
      )
        throw new ReviewHttpError("Password saat ini tidak sesuai.", 403);
    } else if (
      session.user.authMethod !== "google" ||
      Date.now() - (session.user.authenticatedAt ?? 0) > 600000
    )
      throw new ReviewHttpError("Masuk kembali dengan Google sebelum menambahkan password.", 403);
    accounts.db.exec("BEGIN IMMEDIATE");
    try {
      accounts.db
        .prepare("UPDATE accounts SET password_hash=? WHERE id=?")
        .run(passwordHash(body.password), account.id);
      accounts.db.prepare("DELETE FROM account_sessions WHERE account_id=?").run(account.id);
      accounts.db.prepare("DELETE FROM account_links WHERE account_id=?").run(account.id);
      accounts.db.prepare("INSERT OR IGNORE INTO legacy_revocations VALUES (?)").run(account.id);
      accounts.db.exec("COMMIT");
    } catch (error) {
      accounts.db.exec("ROLLBACK");
      throw error;
    }
    return reviewJson({ ok: true, signInAgain: true });
  });
}
