import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/cn";

export function ReviewStars({
  rating,
  size = 16,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={`${rating} dari 5 bintang`}
      className={cn("inline-flex items-center gap-1", className)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const diff = rating - (star - 1);
        const isFull = diff >= 0.75;
        const isHalf = !isFull && diff >= 0.25;

        if (isFull) {
          return (
            <Star
              key={star}
              size={size}
              aria-hidden="true"
              className="fill-amber-400 text-amber-400 shrink-0"
              strokeWidth={1.5}
            />
          );
        }

        if (isHalf) {
          return (
            <span
              key={star}
              className="relative inline-flex items-center justify-center shrink-0"
              style={{ width: size, height: size }}
            >
              <Star
                size={size}
                aria-hidden="true"
                className="text-amber-400/30 shrink-0"
                strokeWidth={1.5}
                fill="none"
              />
              <StarHalf
                size={size}
                aria-hidden="true"
                className="absolute inset-0 fill-amber-400 text-amber-400 shrink-0"
                strokeWidth={1.5}
              />
            </span>
          );
        }

        return (
          <Star
            key={star}
            size={size}
            aria-hidden="true"
            className="text-amber-400/30 shrink-0"
            strokeWidth={1.5}
            fill="none"
          />
        );
      })}
    </span>
  );
}
