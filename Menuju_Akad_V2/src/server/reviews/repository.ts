import "server-only";
import { randomUUID } from "node:crypto";
import type { DatabaseSync, SQLInputValue } from "node:sqlite";
import { reviewInputSchema, type ReviewInput } from "@/features/reviews/domain/review-schema";
import type {
  PrivateReview,
  PublicReview,
  ReviewFilters,
  ReviewPage,
  PublicReviewPage,
} from "@/features/reviews/types";

const PUBLIC_COLUMNS = "id,name,rating,comment,created_at AS createdAt";
const PRIVATE_COLUMNS = `${PUBLIC_COLUMNS},status,updated_at AS updatedAt,moderated_at AS moderatedAt,moderated_by AS moderatedBy`;
const PAGE_SIZE = 12;

export class ReviewRepository {
  constructor(readonly db: DatabaseSync) {}

  submit(input: ReviewInput): PrivateReview {
    const parsed = reviewInputSchema.parse(input);
    const id = randomUUID(),
      now = new Date().toISOString();
    this.db
      .prepare(
        `INSERT INTO website_reviews
      (id,name,rating,comment,status,created_at,updated_at) VALUES (?,?,?,?,'pending',?,?)`,
      )
      .run(id, parsed.name, parsed.rating, parsed.comment, now, now);
    return this.db
      .prepare(`SELECT ${PRIVATE_COLUMNS} FROM website_reviews WHERE id=?`)
      .get(id) as PrivateReview;
  }

  publicList(page: number): PublicReviewPage {
    const result = this.query<PublicReview>(PUBLIC_COLUMNS, "status='published'", [], page);
    const { average } = this.db
      .prepare(
        "SELECT COALESCE(AVG(rating),0) AS average FROM website_reviews WHERE status='published'",
      )
      .get() as { average: number };
    return { ...result, average };
  }

  list(filters: ReviewFilters): ReviewPage<PrivateReview> {
    const clauses: string[] = [],
      values: SQLInputValue[] = [];
    if (filters.status) {
      clauses.push("status=?");
      values.push(filters.status);
    }
    if (filters.rating) {
      clauses.push("rating=?");
      values.push(filters.rating);
    }
    if (filters.search) {
      clauses.push("(instr(lower(name),lower(?))>0 OR instr(lower(comment),lower(?))>0)");
      values.push(filters.search, filters.search);
    }
    return this.query<PrivateReview>(
      PRIVATE_COLUMNS,
      clauses.join(" AND ") || "1=1",
      values,
      filters.page,
    );
  }

  moderate(id: string, status: "published" | "hidden", actor: string): PrivateReview {
    if (!["published", "hidden"].includes(status)) throw new Error("Status ulasan tidak valid.");
    const now = new Date().toISOString();
    const row = this.db
      .prepare(
        `UPDATE website_reviews SET status=?,updated_at=?,moderated_at=?,moderated_by=?
      WHERE id=? RETURNING ${PRIVATE_COLUMNS}`,
      )
      .get(status, now, now, actor, id);
    if (!row) throw new Error("Ulasan tidak ditemukan.");
    return row as PrivateReview;
  }

  private query<T>(
    columns: string,
    where: string,
    values: SQLInputValue[],
    requestedPage: number,
  ): ReviewPage<T> {
    const page = Math.max(1, Math.min(1_000_000, Math.trunc(requestedPage) || 1));
    const { total } = this.db
      .prepare(`SELECT COUNT(*) AS total FROM website_reviews WHERE ${where}`)
      .get(...values) as { total: number };
    const items = this.db
      .prepare(
        `SELECT ${columns} FROM website_reviews WHERE ${where}
      ORDER BY created_at DESC,id DESC LIMIT ? OFFSET ?`,
      )
      .all(...values, PAGE_SIZE, (page - 1) * PAGE_SIZE) as T[];
    return { items, total, page, hasMore: page * PAGE_SIZE < total };
  }
}
