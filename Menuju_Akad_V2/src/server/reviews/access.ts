import "server-only";
import { auth } from "@/server/auth";
import { SESSION_COOKIE } from "./sessions";
import { ReviewHttpError } from "./http";

export function requestSessionToken(request: Request) {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
}
export async function requireSuperadmin(request: Request) {
  void request;
  const account = await getSuperadminSession();
  if (!account) throw new ReviewHttpError("Silakan masuk sebagai superadmin.", 401);
  return account;
}
export async function getSuperadminSession() {
  const session = await auth();
  return session?.user?.role === "superadmin" && session.user.id && session.user.email
    ? { id: session.user.id, email: session.user.email, role: "superadmin" as const }
    : null;
}
