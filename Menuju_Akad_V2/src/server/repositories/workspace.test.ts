import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { getDatabase } from "@/server/db/client";
import { WorkspaceRepository } from "./workspace";

process.env.DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/menujuakad_v2";

describe("WorkspaceRepository", () => {
  let repo: WorkspaceRepository;

  beforeAll(() => {
    repo = new WorkspaceRepository();
  });

  beforeEach(async () => {
    const db = getDatabase();
    await db.workspace.deleteMany();
  });

  it("creates a workspace", async () => {
    const ws = await repo.create({ name: "Test Wedding", slug: "test-wedding", status: "ACTIVE" });
    expect(ws.name).toBe("Test Wedding");
    expect(ws.slug).toBe("test-wedding");
    expect(ws.id).toBeDefined();
  });

  it("finds workspace by slug", async () => {
    await repo.create({ name: "Test", slug: "find-slug", status: "ACTIVE" });
    const found = await repo.findBySlug("find-slug");
    expect(found).not.toBeNull();
    expect(found?.name).toBe("Test");
  });

  it("finds workspace by name", async () => {
    await repo.create({ name: "Unique Name", slug: "unique-name", status: "ACTIVE" });
    const found = await repo.findByName("Unique Name");
    expect(found).not.toBeNull();
  });

  it("lists workspaces with pagination", async () => {
    for (let i = 0; i < 5; i++) {
      await repo.create({ name: `WS ${i}`, slug: `ws-${i}`, status: "ACTIVE" });
    }
    const result = await repo.findMany({}, { page: 1, limit: 3 });
    expect(result.data.length).toBe(3);
    expect(result.pagination.total).toBe(5);
    expect(result.pagination.hasNext).toBe(true);
  });

  it("archives a workspace", async () => {
    const ws = await repo.create({ name: "Archive Me", slug: "archive-me", status: "ACTIVE" });
    const archived = await repo.archive(ws.id);
    expect(archived.status).toBe("ARCHIVED");
  });

  it("counts workspaces", async () => {
    await repo.create({ name: "C1", slug: "c1", status: "ACTIVE" });
    await repo.create({ name: "C2", slug: "c2", status: "ACTIVE" });
    const count = await repo.count({});
    expect(count).toBe(2);
  });

  it("exists check", async () => {
    const ws = await repo.create({ name: "Exists", slug: "exists", status: "ACTIVE" });
    expect(await repo.exists(ws.id)).toBe(true);
    expect(await repo.exists("nonexistent")).toBe(false);
  });

  it("deletes a workspace", async () => {
    const ws = await repo.create({ name: "Delete Me", slug: "delete-me", status: "ACTIVE" });
    await repo.delete(ws.id);
    const found = await repo.findById(ws.id);
    expect(found).toBeNull();
  });
});
