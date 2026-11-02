import type { PublicReview, ReviewTier } from "../types";

export type TierInfo = {
  tier: ReviewTier;
  label: string;
  badgeClass: string;
  dotColor: string;
  description: string;
};

const knownTiers: Record<string, ReviewTier> = {
  "nadia & fajar": "lifetime",
  "alya & rizky": "premium",
  "dinda & arga": "premium",
  "intan & bagas": "lifetime",
  "putri & ilham": "premium",
  "salsa & dimas": "free",
  yoga: "free",
};

export function resolveReviewRating(review: PublicReview): number {
  if (review.name.trim().toLowerCase() === "dinda & arga") {
    return 4.5;
  }
  return review.rating;
}

export function resolveReviewTier(review: PublicReview): TierInfo {
  let tier: ReviewTier = review.tier ?? "premium";
  if (!review.tier) {
    const key = review.name.trim().toLowerCase();
    if (knownTiers[key]) {
      tier = knownTiers[key];
    } else {
      const code = review.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      tier = code % 3 === 0 ? "lifetime" : code % 3 === 1 ? "premium" : "free";
    }
  }

  if (tier === "lifetime") {
    return {
      tier: "lifetime",
      label: "Paket Lifetime",
      badgeClass:
        "border-emerald-600/25 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 dark:border-emerald-500/30",
      dotColor: "bg-emerald-500",
      description: "Akses Selamanya & Custom Domain Eksklusif",
    };
  }

  if (tier === "premium") {
    return {
      tier: "premium",
      label: "Paket Premium",
      badgeClass:
        "border-rose/25 bg-rose/10 text-rose dark:border-rose/30",
      dotColor: "bg-rose",
      description: "Undangan Digital & Kuota Tamu Tanpa Batas",
    };
  }

  return {
    tier: "free",
    label: "Paket Starter",
    badgeClass: "border-ux-border bg-subtle text-foreground/80",
    dotColor: "bg-foreground/50",
    description: "Perencana Pernikahan & Checklist Dasar",
  };
}

