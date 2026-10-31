"use server";

import { auth } from "@/server/auth";
import { getAccounts } from "@/server/identity/runtime";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const accounts = getAccounts();
  const account = accounts.byId(session.user.id);
  if (!account) return null;

  return {
    id: account.id,
    email: account.email,
    name: account.name,
    role: account.role,
    ownerKey: account.owner_key,
  };
}

export async function getCurrentUserOrThrow() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function isSuperadmin() {
  const user = await getCurrentUser();
  return user?.role === "superadmin";
}
