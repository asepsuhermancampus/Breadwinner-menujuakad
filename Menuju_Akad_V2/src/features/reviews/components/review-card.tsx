import type { CSSProperties } from "react";
import { Quote } from "lucide-react";
import type { PublicReview } from "../types";
import { ReviewStars } from "./review-stars";
import styles from "./reviews.module.css";

export function ReviewCard({ review, index = 0 }: { review: PublicReview; index?: number }) {
  const initials = review.name
    .split(/\s+/)
    .filter((word) => word !== "&")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  return (
    <article
      className={styles.card}
      style={{ "--delay": `${Math.min(index, 5) * 70}ms` } as CSSProperties}
    >
      <div className="flex items-center justify-between gap-4">
        <ReviewStars rating={review.rating} />
        <Quote
          className="shrink-0 text-champagne/60"
          size={27}
          strokeWidth={1.2}
          aria-hidden="true"
        />
      </div>
      <p className="my-6 flex-1 whitespace-pre-wrap text-sm leading-7 text-secondary">
        {review.comment}
      </p>
      <div className="flex items-center gap-3 border-t border-ux-border/70 pt-5">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ux-soft text-xs font-semibold text-primary"
        >
          {initials}
        </span>
        <div className="min-w-0">
          <h3 className="break-words text-sm font-semibold text-primary">{review.name}</h3>
          <time dateTime={review.createdAt} className="text-xs text-secondary">
            {new Date(review.createdAt).toLocaleDateString("id-ID", {
              month: "long",
              year: "numeric",
              timeZone: "Asia/Jakarta",
            })}
          </time>
        </div>
      </div>
    </article>
  );
}
