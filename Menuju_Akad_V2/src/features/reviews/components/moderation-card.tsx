import { Eye, EyeOff, Mail, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PrivateReview } from "../types";
import { ReviewStars } from "./review-stars";
import { ReviewPackageBadge } from "./review-package-badge";

export function ModerationCard({
  review,
  saving,
  onModerate,
}: {
  review: PrivateReview;
  saving: boolean;
  onModerate: (id: string, status: "published" | "hidden") => void;
}) {
  const isPending = review.status === "pending";
  const isPublished = review.status === "published";

  return (
    <article className="min-w-0 rounded-card border border-ux-border bg-surface p-5 sm:p-6 shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="break-words text-base font-bold text-foreground">{review.name}</h2>
            <ReviewPackageBadge review={review} />
          </div>
          {review.userEmail && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-secondary">
              <Mail size={12} className="text-muted" aria-hidden="true" />
              <span>{review.userEmail}</span>
            </p>
          )}
          <div className="mt-2.5 flex items-center gap-2">
            <ReviewStars rating={review.rating} size={15} />
            <span className="text-xs font-semibold text-foreground">({review.rating} / 5)</span>
          </div>
        </div>

        <div>
          {isPending && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
              <ShieldAlert size={13} aria-hidden="true" /> Menunggu Moderasi
            </span>
          )}
          {isPublished && (
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              Ditampilkan di Landing
            </span>
          )}
          {!isPending && !isPublished && (
            <span className="rounded-full bg-subtle px-3 py-1 text-xs font-medium text-secondary">
              Disembunyikan
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-ux-border/50 bg-subtle/30 p-4">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground [overflow-wrap:anywhere]">
          &ldquo;{review.comment}&rdquo;
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-ux-border/70 pt-3.5">
        <time dateTime={review.createdAt} className="text-xs text-secondary">
          Dikirim:{" "}
          {new Date(review.createdAt).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Asia/Jakarta",
          })}{" "}
          WIB
        </time>
        <div className="flex flex-wrap gap-2">
          {review.status !== "published" && (
            <Button
              size="small"
              disabled={saving}
              onClick={() => onModerate(review.id, "published")}
            >
              <Eye size={14} aria-hidden="true" />
              Tampilkan di landing
            </Button>
          )}
          {review.status !== "hidden" && (
            <Button
              size="small"
              variant="secondary"
              disabled={saving}
              onClick={() => onModerate(review.id, "hidden")}
            >
              <EyeOff size={14} aria-hidden="true" />
              Sembunyikan
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
