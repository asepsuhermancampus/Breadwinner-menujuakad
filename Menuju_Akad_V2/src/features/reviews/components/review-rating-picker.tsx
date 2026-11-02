"use client";

import { useState } from "react";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/cn";

export function ReviewRatingPicker({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const active = hover ?? value;

  const quickPills = [3.5, 4.0, 4.5, 5.0];

  return (
    <div className="space-y-2.5">
      <div
        className="flex items-center gap-1.5"
        onMouseLeave={() => setHover(null)}
        role="radiogroup"
        aria-label="Pilih bintang ulasan"
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFull = active >= star;
          const isHalf = !isFull && active >= star - 0.5;

          return (
            <div
              key={star}
              className="relative inline-flex size-9 items-center justify-center select-none"
            >
              <Star
                size={32}
                strokeWidth={1.4}
                className="text-amber-400/30"
                fill="none"
                aria-hidden="true"
              />
              {isFull && (
                <Star
                  size={32}
                  strokeWidth={1.4}
                  className="absolute inset-0 fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
              )}
              {isHalf && (
                <StarHalf
                  size={32}
                  strokeWidth={1.4}
                  className="absolute inset-0 fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
              )}

              {!disabled && (
                <>
                  <button
                    type="button"
                    aria-label={`${star === 1 ? 1 : star - 0.5} bintang`}
                    className="absolute inset-y-0 left-0 w-1/2 cursor-pointer z-10 opacity-0"
                    onMouseEnter={() => setHover(star === 1 ? 1 : star - 0.5)}
                    onClick={() => onChange(star === 1 ? 1 : star - 0.5)}
                  />
                  <button
                    type="button"
                    aria-label={`${star} bintang`}
                    className="absolute inset-y-0 right-0 w-1/2 cursor-pointer z-10 opacity-0"
                    onMouseEnter={() => setHover(star)}
                    onClick={() => onChange(star)}
                  />
                </>
              )}
            </div>
          );
        })}

        <span className="ml-2 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
          {active % 1 === 0 ? `${active}.0` : active} / 5
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs">
        <span className="text-[11px] text-muted mr-1">Pilihan cepat:</span>
        {quickPills.map((val) => {
          const selected = value === val;
          return (
            <button
              key={val}
              type="button"
              disabled={disabled}
              onClick={() => onChange(val)}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                selected
                  ? "border-amber-400 bg-amber-400/20 font-bold text-amber-800 dark:text-amber-200"
                  : "border-ux-border bg-surface text-secondary hover:bg-subtle hover:text-foreground",
              )}
            >
              ★ {val % 1 === 0 ? `${val}.0` : val}
            </button>
          );
        })}
      </div>
    </div>
  );
}
