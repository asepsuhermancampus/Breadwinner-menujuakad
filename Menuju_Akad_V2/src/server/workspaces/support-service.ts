import "server-only";
import { randomUUID } from "node:crypto";
import type { WorkspaceService } from "./service";
import { PaymentError } from "@/server/payments/errors";
import { readFeatureAvailability } from "./feature-availability";
export function createSupportRequest(
  workspaces: WorkspaceService,
  owner: string,
  message: string,
  workspaceId?: string,
) {
  if (typeof message !== "string" || message.trim().length < 5 || message.length > 4000)
    throw new PaymentError("Tuliskan pesan bantuan antara 5 dan 4000 karakter", 400);
  const w = workspaces.requireWorkspace(owner, workspaceId);
  if (!readFeatureAvailability(workspaces.db, "support", w.role, w).available)
    throw new PaymentError("Bantuan belum tersedia untuk akun ini.", 403);
  const id = randomUUID();
  const priority = w.subscription.capabilities.includes("priority-support")
    ? "priority"
    : "standard";
  workspaces.db
    .prepare("INSERT INTO customer_support(id,owner,message,priority,created_at) VALUES(?,?,?,?,?)")
    .run(id, owner, message.trim(), priority, new Date().toISOString());
  return { id, priority };
}

