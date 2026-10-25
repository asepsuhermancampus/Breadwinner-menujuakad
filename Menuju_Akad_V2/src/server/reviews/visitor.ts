import "server-only";
import { createHash, randomBytes } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import type { NextResponse } from "next/server";
import { ReviewHttpError } from "./http";

export const VISITOR_COOKIE = "ma_review_visitor";
const SECONDS = 30 * 86400;
const digest = (token: string) => createHash("sha256").update(token).digest("hex");

export function createVisitorToken(db: DatabaseSync) {
  const token = randomBytes(32).toString("hex");
  db.prepare("DELETE FROM review_visitors WHERE expires_at<=?").run(Date.now());
  db.prepare("INSERT INTO review_visitors(token_hash,expires_at) VALUES (?,?)").run(
    digest(token),
    Date.now() + SECONDS * 1000,
  );
  return token;
}
function readVisitor(request: Request, db: DatabaseSync) {
  const token = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${VISITOR_COOKIE}=`))
    ?.slice(VISITOR_COOKIE.length + 1);
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const hash = digest(token);
  return db
    .prepare("SELECT 1 FROM review_visitors WHERE token_hash=? AND expires_at>?")
    .get(hash, Date.now())
    ? hash
    : null;
}
export function requestIdentity(request: Request, db: DatabaseSync) {
  // Trust IPs only behind a proxy explicitly configured to sanitize these headers.
  if (process.env["REVIEWS_TRUST_PROXY"] === "true") {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim().slice(0, 80);
    if (ip) return `ip:${ip}`;
  }
  const visitor = readVisitor(request, db);
  if (!visitor)
    throw new ReviewHttpError("Sesi Anda belum siap. Muat ulang halaman lalu coba kembali.", 428);
  return `visitor:${visitor}`;
}
export function ensureVisitor(request: Request, response: NextResponse, db: DatabaseSync) {
  if (!readVisitor(request, db))
    response.cookies.set(VISITOR_COOKIE, createVisitorToken(db), {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      maxAge: SECONDS,
      secure: process.env.NODE_ENV === "production" || new URL(request.url).protocol === "https:",
    });
  return response;
}
