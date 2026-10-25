import { reviewInputSchema, reviewQuerySchema } from "@/features/reviews/domain/review-schema";
import { getReviewRepository } from "@/server/reviews/runtime";
import {
  assertOrigin,
  readJson,
  reviewAction,
  ReviewHttpError,
  reviewJson,
} from "@/server/reviews/http";
import { consumeLimit } from "@/server/reviews/rate-limit";
import { requestIdentity } from "@/server/reviews/visitor";
export const runtime = "nodejs";

export function GET(request: Request) {
  return reviewAction(() => {
    const { page } = reviewQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams));
    return reviewJson(getReviewRepository().publicList(page));
  });
}
export function POST(request: Request) {
  return reviewAction(async () => {
    assertOrigin(request);
    const repository = getReviewRepository();
    if (
      !consumeLimit(
        repository.db,
        `submit:${requestIdentity(request, repository.db)}`,
        5,
        10 * 60 * 1000,
      )
    )
      throw new ReviewHttpError(
        "Terlalu banyak ulasan dikirim. Silakan coba kembali dalam 10 menit.",
        429,
      );
    const input = reviewInputSchema.parse(await readJson(request));
    repository.submit(input);
    return reviewJson(
      { message: "Terima kasih. Ulasan Anda sudah diterima oleh superadmin." },
      201,
    );
  });
}
