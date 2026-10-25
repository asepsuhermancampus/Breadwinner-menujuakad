import "server-only";
import type { Session } from "next-auth";
import { createHash } from "node:crypto";
import { getReviewRepository } from "@/server/reviews/runtime";
import { consumeLimit } from "@/server/reviews/rate-limit";
import { requestIdentity } from "@/server/reviews/visitor";
export function ownerForSession(session: Session) {
  return (
    session.user.ownerKey ??
    createHash("sha256").update(session.user.email!.trim().toLowerCase()).digest("hex")
  );
}
export function isOperator(session: Session | null) {
  return session?.user?.role === "admin" || session?.user?.role === "superadmin";
}
export function limitAuth(request: Request, email: string, action: "login" | "register") {
  const { db } = getReviewRepository();
  const identity = requestIdentity(request, db);
  if (
    !consumeLimit(db, `auth:${action}:${identity}`, action === "login" ? 15 : 5, 900000) ||
    !consumeLimit(db, `auth:${action}:email:${email.trim().toLowerCase()}`, 30, 900000)
  )
    throw new Error("Terlalu banyak percobaan. Coba kembali dalam 15 menit.");
}
