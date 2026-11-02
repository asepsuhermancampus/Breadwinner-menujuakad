"use client";

import { Quote, ShieldCheck, Calendar, X } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { PublicReview } from "../types";
import { ReviewStars } from "./review-stars";
import { ReviewPackageBadge } from "./review-package-badge";
import { resolveReviewTier } from "../lib/review-tier";

export function ReviewDetailDialog({
  review,
  open,
  onClose,
}: {
  review: PublicReview | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!review) return null;

  const initials = review.name
    .split(/\s+/)
    .filter((word) => word !== "&")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const tierInfo = resolveReviewTier(review);
  const formattedDate = new Date(review.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });

  return (
    <Dialog open={open} onClose={onClose} title="Rincian Pengalaman Pengantin">
      <div className="space-y-6 pt-1">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-ux-border/70 pb-5">
          <div className="flex items-center gap-3.5">
            <span
              aria-hidden="true"
              className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-amber-100 text-base font-bold text-brand-secondary shadow-xs dark:from-emerald-950 dark:to-neutral-900"
            >
              {initials}
            </span>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                {review.name}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <ReviewPackageBadge review={review} size="large" />
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck size={14} aria-hidden="true" /> Terverifikasi
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-control bg-canvas/60 p-3.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Penilaian:</span>
            <ReviewStars rating={review.rating} />
            <span className="font-bold text-foreground">({review.rating}.0 / 5)</span>
          </div>
          <div className="flex items-center gap-1.5 text-secondary">
            <Calendar size={13} aria-hidden="true" />
            <time dateTime={review.createdAt}>{formattedDate}</time>
          </div>
        </div>

        <blockquote className="relative rounded-2xl border border-ux-border/60 bg-surface/80 p-5 shadow-xs">
          <Quote
            className="absolute right-4 top-4 text-champagne/30"
            size={40}
            strokeWidth={1}
            aria-hidden="true"
          />
          <p className="relative z-10 whitespace-pre-wrap text-sm leading-relaxed text-foreground sm:text-base">
            &ldquo;{review.comment}&rdquo;
          </p>
        </blockquote>

        <footer className="flex flex-col gap-3 rounded-xl border border-ux-border/50 bg-subtle/50 p-4 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="text-secondary">
            <p className="font-medium text-foreground">Paket Layanan: {tierInfo.label}</p>
            <p className="text-[11px] text-muted">{tierInfo.description}</p>
          </div>
          <Button variant="secondary" onClick={onClose} className="self-end sm:self-center">
            <X size={14} aria-hidden="true" /> Tutup
          </Button>
        </footer>
      </div>
    </Dialog>
  );
}

