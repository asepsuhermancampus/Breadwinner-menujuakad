import "server-only";
import { z } from "zod";
import { PaymentError } from "@/server/payments/errors";
import type { WorkspaceService } from "./service";
import { oppositeSide, updateProfileSide } from "./update-profile-side";
export const memberProfileSchema = z
  .object({
    fullName: z.string().trim().min(1).max(160),
    nickname: z.string().trim().min(1).max(60),
  })
  .strict();
export const ownProfileSchema = memberProfileSchema.extend({
  side: z.enum(["groom", "bride"]).optional(),
  companion: memberProfileSchema.optional(),
});
export function saveMemberProfile(
  service: WorkspaceService,
  account: string,
  id: string,
  body: unknown,
) {
  const parsed = ownProfileSchema.safeParse(body);
  if (!parsed.success) throw new PaymentError("Profil tidak valid", 400);
  const w = service.requireWorkspace(account, id),
    p = parsed.data;
  if (p.companion && w.partnerAccess?.state !== "connected")
    throw new PaymentError("Profil pasangan belum terhubung", 403);
  const column = w.role === "owner" ? "full_name" : "partner_name";
  const nickname = w.role === "owner" ? "nickname" : "partner_nickname";
  const ownerSide = p.side ? (w.role === "owner" ? p.side : oppositeSide(p.side)) : undefined;
  service.db.exec("SAVEPOINT member_profile");
  try {
    updateProfileSide(service.db, id, w.ownerSide, ownerSide);
    service.db
      .prepare(
        `UPDATE customer_workspaces SET ${column}=?,${nickname}=?,revision=revision+1 WHERE id=?`,
      )
      .run(p.fullName, p.nickname, id);
    if (p.companion)
      service.db
        .prepare(
          `UPDATE customer_workspaces SET ${w.role === "owner" ? "partner_name=?,partner_nickname" : "full_name=?,nickname"}=? WHERE id=?`,
        )
        .run(p.companion.fullName, p.companion.nickname, id);
    service.db.exec("RELEASE member_profile");
  } catch (error) {
    service.db.exec("ROLLBACK TO member_profile; RELEASE member_profile");
    throw error;
  }
  return service.requireWorkspace(account, id);
}
