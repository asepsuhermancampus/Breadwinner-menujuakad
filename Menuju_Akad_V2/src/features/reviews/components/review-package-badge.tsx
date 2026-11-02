import { Sparkles, Crown, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/cn";
import { resolveReviewTier } from "../lib/review-tier";
import type { PublicReview } from "../types";

export function ReviewPackageBadge({
  review,
  className,
  size = "normal",
}: {
  review: PublicReview;
  className?: string;
  size?: "normal" | "large";
}) {
  const info = resolveReviewTier(review);
  const isLarge = size === "large";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wide uppercase transition-all",
        info.badgeClass,
        isLarge ? "px-3.5 py-1 text-xs" : "px-2.5 py-0.5 text-[11px]",
        className,
      )}
    >
      {info.tier === "lifetime" ? (
        <Crown size={isLarge ? 14 : 12} className="shrink-0 text-amber-500" aria-hidden="true" />
      ) : info.tier === "premium" ? (
        <Sparkles size={isLarge ? 14 : 12} className="shrink-0 text-rose" aria-hidden="true" />
      ) : (
        <HeartHandshake
          size={isLarge ? 14 : 12}
          className="shrink-0 text-secondary"
          aria-hidden="true"
        />
      )}
      <span>{info.label}</span>
    </span>
  );
}

