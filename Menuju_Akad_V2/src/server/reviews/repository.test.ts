import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { openReviewDatabase } from "./database";
import { ReviewRepository } from "./repository";
import { seedReviews } from "./seed";
import { reviewInputSchema } from "@/features/reviews/domain/review-schema";
vi.mock("server-only", () => ({}));

const opened: ReturnType<typeof openReviewDatabase>[] = [];
function setup(file = ":memory:") {
  const db = openReviewDatabase(file);
  opened.push(db);
  return { db, repo: new ReviewRepository(db) };
}
const input = { name: "Nadia", rating: 2, comment: "Navigasi tamu masih membingungkan." };
afterEach(() => {
  for (const db of opened.splice(0)) {
    try {
      db.close();
    } catch {}
  }
});

describe("private reviews and publication", () => {
  it("validates integer stars and bounded trimmed text", () => {
    expect(reviewInputSchema.parse({ ...input, name: " Nadia " }).name).toBe("Nadia");
    for (const rating of [0, 6, 1.5, "5", null])
      expect(reviewInputSchema.safeParse({ ...input, rating }).success).toBe(false);
    for (const comment of ["short", "x".repeat(2001), " ".repeat(20)])
      expect(reviewInputSchema.safeParse({ ...input, comment }).success).toBe(false);
  });
  it("stores complaints privately and publishes only an explicit projection", () => {
    const { repo } = setup();
    const review = repo.submit(input);
    expect(review.status).toBe("pending");
    expect(repo.publicList(1).total).toBe(0);
    expect(repo.list({ page: 1 }).items[0]?.comment).toBe(input.comment);
    repo.moderate(review.id, "published", "admin-id");
    const visible = repo.publicList(1);
    expect(visible.total).toBe(1);
    expect(visible.average).toBe(2);
    expect(Object.keys(visible.items[0]!).sort()).toEqual([
      "comment",
      "createdAt",
      "id",
      "name",
      "rating",
    ]);
    repo.moderate(review.id, "hidden", "admin-id");
    expect(repo.publicList(1).items).toEqual([]);
    expect(repo.list({ page: 1, status: "hidden" }).items[0]?.moderatedBy).toBe("admin-id");
  });
  it("has no publication cap and filters literal searches", () => {
    const { repo } = setup();
    for (let i = 0; i < 31; i++) {
      const review = repo.submit({ ...input, name: `Pengguna ${i}` });
      repo.moderate(review.id, "published", "admin-id");
    }
    repo.submit({ ...input, name: "Nama % unik" });
    const first = repo.publicList(1);
    const second = repo.publicList(2);
    const third = repo.publicList(3);
    expect(first.total).toBe(31);
    expect(
      new Set([...first.items, ...second.items, ...third.items].map((item) => item.id)).size,
    ).toBe(31);
    expect(repo.list({ page: 1, search: "%", rating: 2 }).total).toBe(1);
    expect(() => repo.moderate("missing", "hidden", "admin-id")).toThrow();
  });
  it("seeds once and never undoes moderation", () => {
    const { db, repo } = setup();
    seedReviews(db);
    const first = repo.publicList(1);
    expect(first.total).toBeGreaterThan(2);
    repo.moderate(first.items[0]!.id, "hidden", "admin-id");
    const total = repo.list({ page: 1 }).total;
    seedReviews(db);
    expect(repo.list({ page: 1 }).total).toBe(total);
    expect(repo.publicList(1).total).toBe(first.total - 1);
  });
  it("persists submissions across closing and reopening the database", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "review-persistence-"));
    try {
      const file = path.join(directory, "reviews.sqlite");
      const { db, repo } = setup(file);
      const review = repo.submit(input);
      db.close();
      expect(setup(file).repo.list({ page: 1 }).items[0]?.id).toBe(review.id);
      opened.pop()?.close();
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
