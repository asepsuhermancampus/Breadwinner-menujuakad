/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";
vi.mock("server-only", () => ({}));

type MockWorkspace = {
  id: string;
  name: string;
  slug: string;
  status: "ACTIVE" | "ARCHIVED" | "SUSPENDED";
  createdAt: Date;
  updatedAt: Date;
};

const store = new Map<string, MockWorkspace>();

vi.mock("@/server/db/client", () => ({
  getDatabase: () => ({
    workspace: {
      deleteMany: async () => {
        store.clear();
        return { count: 0 };
      },
      create: async ({ data }: { data: any }) => {
        const item: MockWorkspace = {
          id: `ws-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: data.name,
          slug: data.slug,
          status: data.status || "ACTIVE",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        store.set(item.id, item);
        return item;
      },
      findUnique: async ({ where }: { where: any }) => {
        if (where.id) return store.get(where.id) || null;
        if (where.slug) {
          for (const item of store.values()) {
            if (item.slug === where.slug) return item;
          }
        }
        return null;
      },
      findFirst: async ({ where }: { where: any }) => {
        for (const item of store.values()) {
          const expectedName = typeof where.name === "object" ? where.name?.equals : where.name;
          if (expectedName && item.name.toLowerCase() === expectedName.toLowerCase()) return item;
          if (where.slug && item.slug === where.slug) return item;
        }
        return null;
      },
      findMany: async ({ skip = 0, take }: { skip?: number; take?: number }) => {
        const items = Array.from(store.values());
        const sliced = take !== undefined ? items.slice(skip, skip + take) : items.slice(skip);
        return sliced;
      },
      count: async ({ where }: { where?: any } = {}) => {
        if (where?.id) {
          return store.has(where.id) ? 1 : 0;
        }
        return store.size;
      },
      update: async ({ where, data }: { where: any; data: any }) => {
        const existing = store.get(where.id);
        if (!existing) throw new Error("Not found");
        const updated = { ...existing, ...data, updatedAt: new Date() };
        store.set(where.id, updated);
        return updated;
      },
      delete: async ({ where }: { where: any }) => {
        const existing = store.get(where.id);
        store.delete(where.id);
        return existing;
      },
    },
  }),
}));

import { WorkspaceRepository } from "./workspace";
import { getDatabase } from "@/server/db/client";

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
