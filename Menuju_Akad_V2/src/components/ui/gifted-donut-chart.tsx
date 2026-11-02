"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

export type GiftedDonutSlice = {
  id: string;
  percent: number;
  color: string;
  isHatched?: boolean;
};

export type GiftedDonutChartProps = {
  percent: number | null;
  size?: number | undefined;
  strokeWidth?: number | undefined;
  trackColor?: string | undefined;
  gradientColors?: [string, string] | undefined;
  testId?: string | undefined;
  className?: string | undefined;
  slices?: GiftedDonutSlice[] | undefined;
  centerLabel?: string | undefined;
};

/**
 * GiftedDonutChart
 * Komponen Donut / Pie Chart bergaya Gifted Charts (SVG circular progress / multi-slice)
 * dengan track netral, pattern arsiran opsional, dan label persentase di tengah.
 */
export function GiftedDonutChart({
  percent,
  size = 84,
  strokeWidth = 8,
  trackColor,
  gradientColors = ["#065f46", "#10b981"],
  testId = "readiness-percent",
  className,
  slices,
  centerLabel,
}: GiftedDonutChartProps) {
  const gradientId = useId().replace(/:/g, "_");
  const patternId = useId().replace(/:/g, "_");
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const validPercent =
    percent === null || Number.isNaN(percent)
      ? 0
      : Math.max(0, Math.min(100, Math.round(percent)));

  const strokeDashoffset = circumference - (validPercent / 100) * circumference;

  const totalShares = slices ? slices.reduce((acc, s) => acc + s.percent, 0) || 100 : 100;
  let accumulatedLength = 0;

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
          <pattern
            id={patternId}
            width="5"
            height="5"
            patternTransform="rotate(45 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <rect width="5" height="5" fill="var(--canvas, #ffffff)" />
            <line x1="0" y1="0" x2="0" y2="5" stroke="#a7f3d0" strokeWidth="1.5" />
          </pattern>
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

        {/* Multi-slice Pie / Donut Chart */}
        {slices && slices.length > 0 ? (
          slices.map((slice) => {
            const sliceFraction = slice.percent / totalShares;
            const rawLength = sliceFraction * circumference;
            const gap = slices.length > 1 ? 2 : 0;
            const dashLength = Math.max(0, rawLength - gap);
            const dashOffset = -accumulatedLength;
            accumulatedLength += rawLength;

            return (
              <circle
                key={slice.id}
                cx={center}
                cy={center}
                r={radius}
                stroke={slice.isHatched ? `url(#${patternId})` : slice.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={dashOffset}
                fill="none"
                className="transition-all duration-500"
              />
            );
          })
        ) : (
          /* Single Arc Progress fallback */
          validPercent > 0 && (
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
          )
        )}
      </svg>

      {/* Center Label Component */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          data-testid={testId}
          className="font-mono text-lg sm:text-xl font-bold tracking-tight text-foreground"
        >
          {percent === null ? "—" : `${validPercent}%`}
        </span>
        {centerLabel && (
          <span className="text-[9px] font-medium text-secondary tracking-tight">
            {centerLabel}
          </span>
        )}
      </div>
    </div>
  );
}

