import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { readProfilePhoto, writeProfilePhoto } from "./profile-photo-storage";
import { sanitizeProfilePhoto } from "./profile-photo-image";
vi.mock("server-only", () => ({}));

it("retains sanitized photos and URLs after closing and reopening the SQLite file", async () => {
  const directory = mkdtempSync(join(tmpdir(), "ma-profile-photo-"));
  const file = join(directory, "workspace.db");
  let db = new PaymentDatabase(file);
  try {
    const workspace = new WorkspaceService(db.storage()).getOrCreateWorkspace("owner");
    const original = await sharp({
      create: { width: 256, height: 256, channels: 3, background: "blue" },
    })
      .withMetadata({ orientation: 1 })
      .jpeg()
      .toBuffer();
    const sanitized = await sanitizeProfilePhoto(
      `data:image/jpeg;base64,${original.toString("base64")}`,
    );
    expect(await sharp(sanitized).metadata()).toMatchObject({ width: 512, height: 512 });
    expect((await sharp(sanitized).metadata()).exif).toBeUndefined();
    writeProfilePhoto(db.storage(), workspace.id, "owner", sanitized);
    const previousUrl = new WorkspaceService(db.storage()).getOrCreateWorkspace("owner").profile
      .photoUrl;
    db.close();
    db = new PaymentDatabase(file);
    const reloaded = new WorkspaceService(db.storage()).getOrCreateWorkspace("owner");
    expect(reloaded.profile.photoUrl).toBe(previousUrl);
    expect(Buffer.from(readProfilePhoto(db.storage(), workspace.id, "owner"))).toEqual(sanitized);
    expect(reloaded.revision).toBe(1);
  } finally {
    db.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

it("rejects truncated, oversized and decompression-heavy JPEG input", async () => {
  const dataUrl = (image: Buffer) => `data:image/jpeg;base64,${image.toString("base64")}`;
  const original = await sharp({
    create: { width: 512, height: 512, channels: 3, background: "blue" },
  })
    .jpeg()
    .toBuffer();
  await expect(
    sanitizeProfilePhoto(dataUrl(original.subarray(0, original.length - 40))),
  ).rejects.toMatchObject({ httpStatus: 400 });
  await expect(sanitizeProfilePhoto(dataUrl(Buffer.alloc(256 * 1024 + 1)))).rejects.toMatchObject({
    httpStatus: 413,
  });
  const huge = await sharp({
    create: { width: 2048, height: 2048, channels: 3, background: "blue" },
  })
    .jpeg()
    .toBuffer();
  await expect(sanitizeProfilePhoto(dataUrl(huge))).rejects.toMatchObject({ httpStatus: 400 });
});
