import { auth } from "@/server/auth";
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
import { resolveUserPlanTier } from "@/server/reviews/tier";
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
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
      throw new ReviewHttpError(
        "Hanya pengguna yang memiliki akun (minimal paket Free) yang dapat menulis ulasan. Silakan masuk terlebih dahulu.",
        401,
      );
    }
    const repository = getReviewRepository();
    const limitKey = `submit:${session.user.id}`;
    if (!consumeLimit(repository.db, limitKey, 5, 10 * 60 * 1000)) {
      throw new ReviewHttpError(
        "Terlalu banyak ulasan dikirim. Silakan coba kembali dalam 10 menit.",
        429,
      );
    }
    const input = reviewInputSchema.parse(await readJson(request));
    const tier = resolveUserPlanTier(session.user);
    repository.submit(input, {
      tier,
      accountId: session.user.id,
      userEmail: session.user.email,
    });
    return reviewJson(
      {
        message: "Terima kasih! Cerita ulasan Anda telah berhasil disimpan.",
      },
      201,
    );
  });
}
