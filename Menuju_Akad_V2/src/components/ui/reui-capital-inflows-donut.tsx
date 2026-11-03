"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import type { InflowSource, DonutSlice } from "./reui-capital-inflows-types";

type DonutProps = {
  sources?: InflowSource[] | undefined;
  slices?: DonutSlice[] | undefined;
  coveragePercent?: number | undefined;
  centerValue?: string | number | undefined;
  coverageLabel?: string | undefined;
  restPercent?: number | undefined;
  size?: number | undefined;
  selectedSliceId?: string | null | undefined;
  onSelectSlice?: ((id: string | null) => void) | undefined;
};

export function ReuiCapitalInflowsDonut({
  sources = [],
  slices,
  coveragePercent = 0,
  centerValue,
  coverageLabel = "Top 3 pos",
  restPercent = 0,
  size = 170,
  selectedSliceId,
  onSelectSlice,
}: DonutProps) {
  const patternId = useId().replace(/:/g, "_");
  const center = size / 2;
  const strokeWidth = 24;
  const radius = center - strokeWidth / 2 - 4;
  const circumference = 2 * Math.PI * radius;

  const allSlices =
    slices && slices.length > 0
      ? slices.map((s) => ({
          id: s.id,
          label: s.label,
          percent: s.percent,
          color: s.isHatched ? `url(#${patternId})` : s.color,
          isHatched: Boolean(s.isHatched),
        }))
      : [
          ...sources.map((s) => ({
            id: s.id,
            label: s.name,
            percent: s.percentage,
            color: s.color,
            isHatched: false,
          })),
          ...(restPercent > 0
            ? [
                {
                  id: "rest",
                  label: "Lainnya",
                  percent: restPercent,
                  color: `url(#${patternId})`,
                  isHatched: true,
                },
              ]
            : []),
        ];

  const totalShares = allSlices.reduce((acc, s) => acc + s.percent, 0) || 100;
  let accumulatedLength = 0;

  const focusedSlice = allSlices.find((s) => s.id === selectedSliceId);
  const displayCenterValue = focusedSlice
    ? `${focusedSlice.percent}%`
    : centerValue !== undefined
      ? centerValue
      : `${coveragePercent}%`;
  const displayCoverageLabel = focusedSlice
    ? (focusedSlice.label ?? coverageLabel)
    : coverageLabel;

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0 outline-none select-none"
      style={{ width: size, height: size, outline: "none" }}
      role="img"
      aria-label={`Distribusi: ${displayCenterValue} - ${displayCoverageLabel}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg] overflow-visible outline-none focus:outline-none"
        style={{ outline: "none" }}
      >
        <defs>
          <pattern
            id={patternId}
            width="6"
            height="6"
            patternTransform="rotate(45 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <rect width="6" height="6" fill="var(--canvas, #ffffff)" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#a7f3d0" strokeWidth="2" />
          </pattern>
        </defs>

        {/* Base Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="var(--ux-border, #e2e8f0)"
          strokeWidth={strokeWidth}
          fill="none"
          opacity="0.3"
        />

        {/* Donut Slices */}
        {allSlices.map((slice) => {
          const sliceFraction = slice.percent / totalShares;
          const rawLength = sliceFraction * circumference;
          const gap = allSlices.length > 1 ? 3 : 0;
          const dashLength = Math.max(0, rawLength - gap);
          const dashOffset = -accumulatedLength;
          accumulatedLength += rawLength;

          const isSelected = selectedSliceId === slice.id;
          const isAnySelected = Boolean(selectedSliceId);
          const currentStrokeWidth = isSelected ? strokeWidth + 5 : strokeWidth;
          const opacity = isAnySelected ? (isSelected ? 1 : 0.35) : 1;

          return (
            <circle
              key={slice.id}
              data-slice-id={slice.id}
              cx={center}
              cy={center}
              r={radius}
              stroke={slice.color}
              strokeWidth={currentStrokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              fill="none"
              opacity={opacity}
              pointerEvents={onSelectSlice ? "stroke" : "none"}
              onClick={() => onSelectSlice?.(isSelected ? null : slice.id)}
              className={cn(
                "transition-all duration-300 outline-none select-none",
                onSelectSlice && "cursor-pointer hover:opacity-90",
              )}
              style={{ outline: "none" }}
              aria-label={slice.label ? `${slice.label}: ${slice.percent}%` : undefined}
            />
          );
        })}
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
        <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate max-w-full">
          {displayCenterValue}
        </span>
        <span className="text-[10px] font-medium text-secondary tracking-tight truncate max-w-full">
          {displayCoverageLabel}
        </span>
      </div>
    </div>
  );
}
