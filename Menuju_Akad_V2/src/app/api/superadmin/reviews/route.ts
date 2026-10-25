import { reviewQuerySchema } from "@/features/reviews/domain/review-schema";
import type { ReviewFilters } from "@/features/reviews/types";
import { getReviewRepository } from "@/server/reviews/runtime";
import { requireSuperadmin } from "@/server/reviews/access";
import { reviewAction, reviewJson } from "@/server/reviews/http";
export const runtime = "nodejs";

export function GET(request: Request) {
  return reviewAction(async () => {
    await requireSuperadmin(request);
    const query = reviewQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams));
    const filters: ReviewFilters = { page: query.page };
    if (query.status) filters.status = query.status;
    if (query.rating) filters.rating = query.rating;
    if (query.search) filters.search = query.search;
    return reviewJson(getReviewRepository().list(filters));
  });
}
