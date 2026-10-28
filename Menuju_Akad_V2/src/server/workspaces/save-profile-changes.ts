import "server-only";
import { z } from "zod";
import type { WorkspaceService } from "./service";
import { ownProfileSchema, saveMemberProfile } from "./member-profile";
import { MAX_PROFILE_PHOTO_BODY, sanitizeProfilePhoto } from "./profile-photo-image";
import { writeProfilePhoto, type ProfilePhotoSlot } from "./profile-photo-storage";
import { PaymentError } from "@/server/payments/errors";
export const MAX_PROFILE_CHANGES_BODY = MAX_PROFILE_PHOTO_BODY * 2 + 4096;
const schema = ownProfileSchema.extend({
  photos: z
    .object({ owner: z.string().nullable().optional(), partner: z.string().nullable().optional() })
    .strict()
    .optional(),
});
export async function saveProfileChanges(
  service: WorkspaceService,
  account: string,
  id: string,
  input: unknown,
) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) throw new PaymentError("Profil tidak valid", 400);
  const { photos, ...profile } = parsed.data;
  const assertAccess = () => {
    const w = service.requireWorkspace(account, id);
    if (
      w.partnerAccess?.state !== "connected" &&
      (profile.companion || photos?.partner !== undefined)
    )
      throw new PaymentError("Profil pasangan belum terhubung", 403);
  };
  assertAccess();
  const images: [ProfilePhotoSlot, Buffer | null][] = [];
  for (const slot of ["owner", "partner"] as const) {
    const photo = photos?.[slot];
    if (photo !== undefined)
      images.push([slot, photo === null ? null : await sanitizeProfilePhoto(photo)]);
  }
  const db = service.db;
  db.exec("BEGIN IMMEDIATE");
  try {
    assertAccess();
    saveMemberProfile(service, account, id, profile);
    for (const [slot, image] of images) writeProfilePhoto(db, id, slot, image, false);
    const workspace = service.requireWorkspace(account, id);
    db.exec("COMMIT");
    return workspace;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
