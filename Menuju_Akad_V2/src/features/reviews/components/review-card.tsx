"use client";

import type { CSSProperties } from "react";
import { Quote, ArrowRight, ShieldCheck } from "lucide-react";
import type { PublicReview } from "../types";
import { ReviewStars } from "./review-stars";
import { ReviewPackageBadge } from "./review-package-badge";
import styles from "./reviews.module.css";

export function ReviewCard({
  review,
  index = 0,
  onSelect,
}: {
  review: PublicReview;
  index?: number;
  onSelect?: (review: PublicReview) => void;
}) {
  const initials = review.name
    .split(/\s+/)
    .filter((word) => word !== "&")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(review)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(review);
        }
      }}
      className={styles.modernCard}
      style={{ "--delay": `${Math.min(index, 6) * 60}ms` } as CSSProperties}
      aria-label={`Ulasan dari ${review.name}`}
    >
      <header className="flex items-center justify-between gap-3">
        <ReviewStars rating={review.rating} />
        <ReviewPackageBadge review={review} />
      </header>

      <div className="relative my-4 flex-1">
        <Quote
          className="absolute -right-1 -top-2 text-champagne/20"
          size={32}
          strokeWidth={1}
          aria-hidden="true"
        />
        <p className="line-clamp-3 text-xs leading-relaxed text-secondary sm:text-sm sm:leading-6">
          &ldquo;{review.comment}&rdquo;
        </p>
      </div>

      <div className="mt-auto border-t border-ux-border/60 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-amber-50 text-xs font-bold text-brand-secondary shadow-2xs dark:from-emerald-950 dark:to-neutral-900"
            >
              {initials}
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-xs font-bold text-foreground sm:text-sm">
                {review.name}
              </h3>
              <p className="flex items-center gap-1 text-[11px] text-muted">
                <ShieldCheck size={11} className="text-emerald-600 dark:text-emerald-400" />
                <span>Terverifikasi</span>
              </p>
            </div>
          </div>

          <span className="flex items-center gap-1 text-[11px] font-semibold text-primary transition-transform group-hover:translate-x-0.5">
            <span>Rincian</span>
            <ArrowRight size={12} aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
}
