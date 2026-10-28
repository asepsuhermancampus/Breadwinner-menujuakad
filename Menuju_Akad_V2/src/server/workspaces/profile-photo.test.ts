import { afterEach, beforeEach, expect, it, vi } from "vitest";
import sharp from "sharp";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
const mocks = vi.hoisted(() => ({ auth: vi.fn(), workspaces: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/server/auth", () => ({ auth: mocks.auth }));
vi.mock("@/server/workspaces/runtime", () => ({ getWorkspaceService: mocks.workspaces }));
import { DELETE, GET, PUT } from "@/app/api/workspace/profile-photo/route";

let db: PaymentDatabase, service: WorkspaceService, id: string, dataUrl: string;
const session = (ownerKey: string) => ({ user: { email: `${ownerKey}@example.test`, ownerKey } });
beforeEach(async () => {
  db = new PaymentDatabase();
  service = new WorkspaceService(db.storage());
  id = service.getOrCreateWorkspace("owner").id;
  mocks.workspaces.mockReturnValue(service);
  mocks.auth.mockResolvedValue(session("owner"));
  const bytes = await sharp({ create: { width: 512, height: 512, channels: 3, background: "red" } })
    .jpeg()
    .toBuffer();
  dataUrl = `data:image/jpeg;base64,${bytes.toString("base64")}`;
});
afterEach(() => {
  db.close();
  vi.clearAllMocks();
});
const url = (slot = "owner") =>
  `http://localhost:3200/api/workspace/profile-photo?workspace=${id}&slot=${slot}`;
const put = (value: unknown = dataUrl, slot = "owner", origin = "http://localhost:3200") =>
  PUT(
    new Request(url(), {
      method: "PUT",
      headers: { origin, "Content-Type": "application/json" },
      body: JSON.stringify({ slot, dataUrl: value }),
    }),
  );

it("persists both photos, exposes private versioned URLs and keeps text saves independent", async () => {
  expect((await put(dataUrl, "owner")).status).toBe(200);
  expect((await put(dataUrl, "partner")).status).toBe(403);
  db.storage().prepare("INSERT INTO workspace_members VALUES(?,?,'partner')").run(id, "partner");
  expect((await put(dataUrl, "partner")).status).toBe(200);
  mocks.auth.mockResolvedValue(session("partner"));
  expect((await put(dataUrl, "partner")).status).toBe(200);
  mocks.auth.mockResolvedValue(session("owner"));
  service = new WorkspaceService(db.storage());
  const profile = service.getOrCreateWorkspace("owner").profile;
  expect(profile.photoUrl).toMatch(/slot=owner&v=/);
  expect(profile.partnerPhotoUrl).toMatch(/slot=partner&v=/);
  service.saveProfile("owner", { fullName: "Risa", partnerName: "Andi" });
  expect(service.getOrCreateWorkspace("owner").profile.photoUrl).toBe(profile.photoUrl);
  const response = await GET(new Request(`http://localhost:3200${profile.photoUrl}`));
  expect(response.status).toBe(200);
  expect(response.headers.get("cache-control")).toContain("private");
  expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  expect(await sharp(Buffer.from(await response.arrayBuffer())).metadata()).toMatchObject({
    format: "jpeg",
    width: 512,
    height: 512,
  });
  expect((await put()).status).toBe(200);
  expect(service.getOrCreateWorkspace("owner").profile.photoUrl).not.toBe(profile.photoUrl);
});

it("requires membership and permits both connected partners to manage profile photos", async () => {
  await put();
  mocks.auth.mockResolvedValue(null);
  expect((await GET(new Request(url()))).status).toBe(401);
  expect((await put()).status).toBe(401);
  mocks.auth.mockResolvedValue(session("stranger"));
  expect((await GET(new Request(url()))).status).toBe(404);
  expect((await put()).status).toBe(404);
  db.storage().prepare("INSERT INTO workspace_members VALUES(?,?,'partner')").run(id, "partner");
  mocks.auth.mockResolvedValue(session("partner"));
  expect((await GET(new Request(url()))).status).toBe(200);
  expect((await put(dataUrl, "partner")).status).toBe(200);
  expect((await put(dataUrl, "owner")).status).toBe(200);
  expect(
    (
      await DELETE(
        new Request(url(), { method: "DELETE", headers: { origin: "http://localhost:3200" } }),
      )
    ).status,
  ).toBe(200);
});

it("rejects hostile origins, oversized bodies, invalid slots, spoofed data and malformed JPEGs", async () => {
  expect((await put(dataUrl, "owner", "https://evil.test")).status).toBe(403);
  expect((await put(dataUrl, "other")).status).toBe(400);
  for (const invalid of [
    "data:image/svg+xml;base64,PHN2Zz4=",
    "data:image/jpeg;base64,!!!!",
    "data:image/jpeg;base64,YWJj",
    dataUrl + "garbage",
  ]) {
    expect((await put(invalid)).status).toBe(400);
  }
  const png = await sharp({ create: { width: 512, height: 512, channels: 3, background: "red" } })
    .png()
    .toBuffer();
  expect((await put(`data:image/jpeg;base64,${png.toString("base64")}`)).status).toBe(400);
  const rectangular = await sharp({
    create: { width: 512, height: 300, channels: 3, background: "red" },
  })
    .jpeg()
    .toBuffer();
  expect((await put(`data:image/jpeg;base64,${rectangular.toString("base64")}`)).status).toBe(400);
  expect((await put("x".repeat(360000))).status).toBe(413);
  expect(service.getOrCreateWorkspace("owner").profile.photoUrl).toBeNull();
});

it("deletes only the selected slot", async () => {
  await put();
  db.storage().prepare("INSERT INTO workspace_members VALUES(?,?,'partner')").run(id, "partner");
  mocks.auth.mockResolvedValue(session("partner"));
  await put(dataUrl, "partner");
  mocks.auth.mockResolvedValue(session("owner"));
  const deleted = await DELETE(
    new Request(url(), { method: "DELETE", headers: { origin: "http://localhost:3200" } }),
  );
  expect(deleted.status).toBe(200);
  expect(service.getOrCreateWorkspace("owner").profile.photoUrl).toBeNull();
  expect(service.getOrCreateWorkspace("owner").profile.partnerPhotoUrl).toBeTruthy();
  expect((await GET(new Request(url()))).status).toBe(404);
});
it("lets the parent manage the connected partner photo and blocks it after revocation", async () => {
  db.storage().prepare("INSERT INTO workspace_members VALUES(?,?,'partner')").run(id, "partner");
  expect((await put(dataUrl, "partner")).status).toBe(200);
  expect(service.getOrCreateWorkspace("owner").profile.partnerPhotoUrl).toBeTruthy();
  db.storage()
    .prepare("DELETE FROM workspace_members WHERE workspace_id=? AND role='partner'")
    .run(id);
  expect((await put(dataUrl, "partner")).status).toBe(403);
});
it("hides disconnected photos and clears the previous recipient photo on acceptance", async () => {
  await put();
  db.storage()
    .prepare("INSERT INTO workspace_profile_photos VALUES(?, 'partner', ?, 'legacy')")
    .run(id, Buffer.from("legacy"));
  expect((await GET(new Request(url("partner")))).status).toBe(404);
  expect(service.getOrCreateWorkspace("owner").profile.partnerPhotoUrl).toBeNull();
});
