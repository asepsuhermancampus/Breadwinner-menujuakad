import { auth } from "@/server/auth";
import { ensureVisitor } from "@/server/reviews/visitor";
import { getReviewRepository } from "@/server/reviews/runtime";
import { reviewAction, reviewJson } from "@/server/reviews/http";
import { resolveUserPlanTier } from "@/server/reviews/tier";

export const runtime = "nodejs";

export function GET(request: Request) {
  return reviewAction(async () => {
    const session = await auth();
    const user = session?.user;
    const authenticated = Boolean(user?.id && user?.email);
    const tier = authenticated ? resolveUserPlanTier(user) : null;

    const response = reviewJson({
      authenticated,
      user: authenticated
        ? {
            id: user!.id,
            name: user!.name ?? "Pengantin",
            email: user!.email,
            role: user!.role ?? "customer",
            tier,
          }
        : null,
    });
    return ensureVisitor(request, response, getReviewRepository().db);
  });
}
