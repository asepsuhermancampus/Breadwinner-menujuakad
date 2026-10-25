import "server-only";
import { cookies } from "next/headers";
import { randomBytes, createHash } from "node:crypto";
import { auth } from "@/server/auth";
import { ownerForSession } from "@/server/identity/policy";
import type { CheckoutPrincipal } from "./intent-types";

export async function guestHash(create: boolean, secure: boolean): Promise<string | null> {
  const jar = await cookies();
  let token = jar.get("ma-checkout")?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    if (!create) return null;
    token = randomBytes(32).toString("hex");
    jar.set("ma-checkout", token, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 86400,
    });
  }
  return createHash("sha256").update(token).digest("hex");
}

export async function checkoutPrincipal(
  req: Request,
  create: boolean,
): Promise<CheckoutPrincipal | null> {
  const session = await auth();
  if (session?.user?.email) return { kind: "owner", owner: ownerForSession(session) };
  const hash = await guestHash(create, new URL(req.url).protocol === "https:");
  return hash ? { kind: "guest", hash } : null;
}
