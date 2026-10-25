import { moderationSchema } from "@/features/reviews/domain/review-schema";
import { getReviewRepository } from "@/server/reviews/runtime";
import { requireSuperadmin } from "@/server/reviews/access";
import {
  assertOrigin,
  readJson,
  reviewAction,
  ReviewHttpError,
  reviewJson,
} from "@/server/reviews/http";
export const runtime = "nodejs";

export function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  return reviewAction(async () => {
    assertOrigin(request);
    const account = await requireSuperadmin(request);
    const { id } = await context.params;
    const { status } = moderationSchema.parse(await readJson(request));
    if (!getReviewRepository().db.prepare("SELECT id FROM website_reviews WHERE id=?").get(id))
      throw new ReviewHttpError("Ulasan tidak ditemukan.", 404);
    return reviewJson({ review: getReviewRepository().moderate(id, status, account.id) });
  });
}
