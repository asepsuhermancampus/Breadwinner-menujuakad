import { afterEach, beforeEach, expect, it, vi } from "vitest";
import sharp from "sharp";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { MembershipService } from "./membership-service";
import { saveProfileChanges } from "./save-profile-changes";
vi.mock("server-only", () => ({}));
let db: PaymentDatabase, service: WorkspaceService, id: string, photo: string;
beforeEach(async () => {
  db = new PaymentDatabase();
  service = new WorkspaceService(db.storage());
  id = service.getOrCreateWorkspace("owner").id;
  const membership = new MembershipService(service);
  membership.acceptPartnerInvite("child", membership.invitePartner("owner").token, {
    fullName: "Child",
    nickname: "C",
  });
  const image = await sharp({
    create: { width: 512, height: 512, channels: 3, background: "green" },
  })
    .jpeg()
    .toBuffer();
  photo = `data:image/jpeg;base64,${image.toString("base64")}`;
});
afterEach(() => db.close());
it("saves both names, position and both photos in one save from the invited account", async () => {
  const saved = await saveProfileChanges(service, "child", id, {
    fullName: "Child Updated",
    nickname: "Ci",
    side: "bride",
    companion: { fullName: "Owner Updated", nickname: "Ow" },
    photos: { owner: photo, partner: photo },
  });
  expect(saved.profile).toMatchObject({ fullName: "Owner Updated", partnerName: "Child Updated" });
  expect(saved.profile.photoUrl).toContain("slot=owner");
  expect(saved.profile.partnerPhotoUrl).toContain("slot=partner");
  expect(saved.ownerSide).toBe("groom");
  const removed = await saveProfileChanges(service, "owner", id, {
    fullName: "Owner Updated",
    nickname: "Ow",
    photos: { owner: null, partner: null },
  });
  expect(removed.profile.photoUrl).toBeNull();
  expect(removed.profile.partnerPhotoUrl).toBeNull();
});
it("rejects invalid photos without partially changing either name or position", async () => {
  const before = service.requireWorkspace("child", id);
  await expect(
    saveProfileChanges(service, "child", id, {
      fullName: "Changed",
      nickname: "New",
      side: "bride",
      photos: { owner: photo, partner: "invalid" },
    }),
  ).rejects.toThrow();
  expect(service.requireWorkspace("child", id)).toEqual(before);
});
it("rolls back profile updates when writing a photo fails", async () => {
  const before = service.requireWorkspace("child", id);
  db.storage().exec(
    "CREATE TRIGGER reject_photo BEFORE INSERT ON workspace_profile_photos BEGIN SELECT RAISE(ABORT,'photo failed'); END",
  );
  await expect(
    saveProfileChanges(service, "child", id, {
      fullName: "Changed",
      nickname: "New",
      side: "bride",
      photos: { partner: photo },
    }),
  ).rejects.toThrow("photo failed");
  expect(service.requireWorkspace("child", id)).toEqual(before);
});
it("denies revoked members and keeps the unconnected partner slot locked", async () => {
  new MembershipService(service).revokePartner("owner", id);
  await expect(
    saveProfileChanges(service, "child", id, {
      fullName: "Child",
      nickname: "C",
      photos: { owner: photo },
    }),
  ).rejects.toThrow();
  await expect(
    saveProfileChanges(service, "owner", id, {
      fullName: "Owner",
      nickname: "O",
      photos: { partner: photo },
    }),
  ).rejects.toThrow();
});
