"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

export type GiftedDonutChartProps = {
  percent: number | null;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  gradientColors?: [string, string];
  testId?: string;
  className?: string;
};

/**
 * GiftedDonutChart
 * Komponen Donut Chart bergaya Gifted Charts (SVG circular progress)
 * dengan rounded stroke, track netral, dan label persentase di tengah.
 */
export function GiftedDonutChart({
  percent,
  size = 84,
  strokeWidth = 8,
  trackColor,
  gradientColors = ["#065f46", "#10b981"],
  testId = "readiness-percent",
  className,
}: GiftedDonutChartProps) {
  const gradientId = useId().replace(/:/g, "_");
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const validPercent =
    percent === null || Number.isNaN(percent)
      ? 0
      : Math.max(0, Math.min(100, Math.round(percent)));

  const strokeDashoffset = circumference - (validPercent / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center shrink-0", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Kesiapan: ${percent === null ? "belum ada data" : `${validPercent}%`}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg] overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientColors[0]} />
            <stop offset="100%" stopColor={gradientColors[1]} />
          </linearGradient>
        </defs>

        {/* Background Track Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={trackColor ?? "currentColor"}
          strokeWidth={strokeWidth}
          fill="none"
          className="text-emerald-950/10 dark:text-emerald-100/10"
        />

        {/* Active Progress Circle */}
        {validPercent > 0 && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            style={{
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        )}
      </svg>

      {/* Center Label Component (Gifted Charts signature style) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          data-testid={testId}
          className="font-mono text-xl font-bold tracking-tight text-foreground"
        >
          {percent === null ? "—" : `${validPercent}%`}
        </span>
      </div>
    </div>
  );
}

