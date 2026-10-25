import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PrivateReview } from "../types";
import { ReviewStars } from "./review-stars";

export function ModerationCard({
  review,
  saving,
  onModerate,
}: {
  review: PrivateReview;
  saving: boolean;
  onModerate: (id: string, status: "published" | "hidden") => void;
}) {
  const label = { pending: "Menunggu", published: "Ditampilkan", hidden: "Disembunyikan" }[
    review.status
  ];
  const badge =
    review.status === "published"
      ? "bg-success-bg text-success"
      : review.status === "pending"
        ? "bg-warning-bg text-warning"
        : "bg-subtle text-secondary";
  return (
    <article className="min-w-0 rounded-card border border-ux-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="break-words font-semibold text-primary">{review.name}</h2>
          <div className="mt-2">
            <ReviewStars rating={review.rating} />
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${badge}`}>{label}</span>
      </div>
      <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-secondary [overflow-wrap:anywhere]">
        {review.comment}
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-ux-border pt-4">
        <time dateTime={review.createdAt} className="text-xs text-secondary">
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
