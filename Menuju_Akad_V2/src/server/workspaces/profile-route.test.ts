import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
const mocks = vi.hoisted(() => ({ auth: vi.fn(), workspaces: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => undefined }) }));
vi.mock("server-only", () => ({}));
vi.mock("@/server/auth", () => ({ auth: mocks.auth }));
vi.mock("@/server/workspaces/runtime", () => ({ getWorkspaceService: mocks.workspaces }));
import { PATCH } from "@/app/api/workspace/route";
let db: PaymentDatabase, service: WorkspaceService;
beforeEach(() => {
  db = new PaymentDatabase();
  service = new WorkspaceService(db.storage());
  mocks.workspaces.mockReturnValue(service);
  mocks.auth.mockResolvedValue({ user: { email: "a@example.test", ownerKey: "a" } });
});
afterEach(() => {
  db.close();
  vi.clearAllMocks();
});
const request = (body: unknown) =>
  new Request("http://localhost:3200/api/workspace", {
    method: "PATCH",
    headers: { origin: "http://localhost:3200", "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
it("accepts nicknames, rejects unknown keys and retains account ownership", async () => {
  const body = { fullName: "Risa", nickname: "Ica" };
  expect((await PATCH(request({ ...body, partnerName: "Hack" }))).status).toBe(400);
  expect((await PATCH(request({ ...body, partnerNickname: "Hack" }))).status).toBe(400);
  expect((await PATCH(request({ ...body, owner: "other" }))).status).toBe(400);
  expect(
    (await PATCH(request({ ...body, photoUrl: "https://example.test/photo.jpg" }))).status,
  ).toBe(400);
  expect((await PATCH(request({ ...body, partnerPhotoUrl: "data:image/svg+xml,x" }))).status).toBe(
    400,
  );
  expect((await PATCH(request(body))).status).toBe(200);
  expect(service.getOrCreateWorkspace("a").profile).toMatchObject(body);
  expect(service.getOrCreateWorkspace("other").profile.nickname).toBe("");
  expect((await PATCH(request({ ...body, nickname: "x".repeat(61) }))).status).toBe(400);
  expect((await PATCH(request({ fullName: "Risa Baru", nickname: "Ica" }))).status).toBe(200);
  expect(service.getOrCreateWorkspace("a").profile.nickname).toBe("Ica");
});
