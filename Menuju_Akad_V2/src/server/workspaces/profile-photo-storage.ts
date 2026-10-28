import "server-only";
import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { PaymentError } from "@/server/payments/errors";

export type ProfilePhotoSlot = "owner" | "partner";
export function profilePhotoSlot(value: unknown): ProfilePhotoSlot {
  if (value !== "owner" && value !== "partner")
    throw new PaymentError("Pilihan foto profil tidak valid", 400);
  return value;
}

export function profilePhotoUrls(db: DatabaseSync, workspace: string) {
  const urls: { photoUrl: string | null; partnerPhotoUrl: string | null } = {
    photoUrl: null,
    partnerPhotoUrl: null,
  };
  for (const row of db
    .prepare("SELECT slot,version FROM workspace_profile_photos WHERE workspace_id=?")
    .all(workspace)) {
    const key = row["slot"] === "owner" ? "photoUrl" : "partnerPhotoUrl";
    urls[key] =
      `/api/workspace/profile-photo?workspace=${encodeURIComponent(workspace)}&slot=${row["slot"]}&v=${row["version"]}`;
  }
  return urls;
}

export function writeProfilePhoto(
  db: DatabaseSync,
  workspace: string,
  slot: ProfilePhotoSlot,
  image: Buffer | null,
  transaction = true,
) {
  if (transaction) db.exec("BEGIN IMMEDIATE");
  try {
    if (image) {
      db.prepare(
        `INSERT INTO workspace_profile_photos(workspace_id,slot,image,version) VALUES(?,?,?,?)
        ON CONFLICT(workspace_id,slot) DO UPDATE SET image=excluded.image,version=excluded.version`,
      ).run(workspace, slot, image, randomUUID());
    } else
      db.prepare("DELETE FROM workspace_profile_photos WHERE workspace_id=? AND slot=?").run(
        workspace,
        slot,
      );
    db.prepare("UPDATE customer_workspaces SET revision=revision+1 WHERE id=?").run(workspace);
    if (transaction) db.exec("COMMIT");
  } catch (error) {
    if (transaction) db.exec("ROLLBACK");
    throw error;
  }
}

export function readProfilePhoto(db: DatabaseSync, workspace: string, slot: ProfilePhotoSlot) {
  const row = db
    .prepare("SELECT image FROM workspace_profile_photos WHERE workspace_id=? AND slot=?")
    .get(workspace, slot);
  if (!row) throw new PaymentError("Foto profil tidak ditemukan", 404);
  return new Uint8Array(row["image"] as Uint8Array);
}
