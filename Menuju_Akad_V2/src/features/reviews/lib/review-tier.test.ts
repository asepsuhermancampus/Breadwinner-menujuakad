import { describe, expect, it } from "vitest";
import { resolveReviewRating, resolveReviewTier } from "./review-tier";
import type { PublicReview } from "../types";

describe("resolveReviewTier", () => {
  it("resolves user plan tiers correctly into Paket Free, Paket Premium, and Paket Lifetime", () => {
    const freeReview: PublicReview = {
      id: "rev-free",
      name: "Budi & Ani",
      rating: 5,
      comment: "Bagus sekali aplikasinya",
      createdAt: new Date().toISOString(),
      tier: "free",
    };
    const premiumReview: PublicReview = {
      id: "rev-prem",
      name: "Ferry & Citra",
      rating: 5,
      comment: "Undangan digitalnya sangat elegan",
      createdAt: new Date().toISOString(),
      tier: "premium",
    };
    const lifetimeReview: PublicReview = {
      id: "rev-life",
      name: "Doni & Maya",
      rating: 5,
      comment: "Domain kustom dan akses selamanya mantap",
      createdAt: new Date().toISOString(),
      tier: "lifetime",
    };

    const freeInfo = resolveReviewTier(freeReview);
    expect(freeInfo.label).toBe("Paket Free");
    expect(freeInfo.tier).toBe("free");

    const premInfo = resolveReviewTier(premiumReview);
    expect(premInfo.label).toBe("Paket Premium");
    expect(premInfo.tier).toBe("premium");

    const lifeInfo = resolveReviewTier(lifetimeReview);
    expect(lifeInfo.label).toBe("Paket Lifetime");
    expect(lifeInfo.tier).toBe("lifetime");
  });

  it("resolves sample seed reviews to their corresponding known tier", () => {
    const nadiaReview: PublicReview = {
      id: "initial-review-1",
      name: "Nadia & Fajar",
      rating: 5,
      comment: "Ulasan awal",
      createdAt: new Date().toISOString(),
      sample: 1,
    };
    expect(resolveReviewTier(nadiaReview).label).toBe("Paket Lifetime");

    const alyaReview: PublicReview = {
      id: "initial-review-2",
      name: "Alya & Rizky",
      rating: 5,
      comment: "Ulasan awal",
      createdAt: new Date().toISOString(),
      sample: 1,
    };
    expect(resolveReviewTier(alyaReview).label).toBe("Paket Premium");

    const salsaReview: PublicReview = {
      id: "initial-review-6",
      name: "Salsa & Dimas",
      rating: 4,
      comment: "Ulasan awal",
      createdAt: new Date().toISOString(),
      sample: 1,
    };
    expect(resolveReviewTier(salsaReview).label).toBe("Paket Free");
  });

  it("resolves rating special case for Dinda & Arga", () => {
    const review: PublicReview = {
      id: "initial-review-3",
      name: "Dinda & Arga",
      rating: 4,
      comment: "Ulasan dinda",
      createdAt: new Date().toISOString(),
    };
    expect(resolveReviewRating(review)).toBe(4.5);
  });
});

