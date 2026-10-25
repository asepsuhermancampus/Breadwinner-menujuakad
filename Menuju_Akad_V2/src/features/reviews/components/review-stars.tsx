import { Star } from "lucide-react";

export function ReviewStars({ rating }: { rating: number }) {
  return (
    <span
      role="img"
      aria-label={`${rating} dari 5 bintang`}
      className="inline-flex gap-1 text-ux-gold-ink"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          aria-hidden="true"
          fill={star <= rating ? "currentColor" : "none"}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}
