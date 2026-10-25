import { ensureVisitor } from "@/server/reviews/visitor";
import { getReviewRepository } from "@/server/reviews/runtime";
import { reviewAction, reviewJson } from "@/server/reviews/http";
export const runtime = "nodejs";
export function GET(request: Request) {
  return reviewAction(() =>
    ensureVisitor(request, reviewJson({ ok: true }), getReviewRepository().db),
  );
}
