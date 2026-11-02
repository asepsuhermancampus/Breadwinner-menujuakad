"use client";

import { useId } from "react";
import type { InflowSource, DonutSlice } from "./reui-capital-inflows-types";

type DonutProps = {
  sources?: InflowSource[] | undefined;
  slices?: DonutSlice[] | undefined;
  coveragePercent: number;
  coverageLabel?: string | undefined;
  restPercent?: number | undefined;
  size?: number | undefined;
};

export function ReuiCapitalInflowsDonut({
  sources = [],
  slices,
  coveragePercent,
  coverageLabel = "Top 3 pos",
  restPercent = 0,
  size = 170,
}: DonutProps) {
  const patternId = useId().replace(/:/g, "_");
  const center = size / 2;
  const strokeWidth = 24;
  const radius = center - strokeWidth / 2 - 4;
  const circumference = 2 * Math.PI * radius;

  // Prepare slices: prefer custom slices if provided, otherwise build from sources
  const allSlices =
    slices && slices.length > 0
      ? slices.map((s) => ({
          id: s.id,
          percent: s.percent,
          color: s.isHatched ? `url(#${patternId})` : s.color,
          isHatched: Boolean(s.isHatched),
        }))
      : [
          ...sources.map((s) => ({
            id: s.id,
            percent: s.percentage,
            color: s.color,
            isHatched: false,
          })),
          ...(restPercent > 0
            ? [
                {
                  id: "rest",
                  percent: restPercent,
                  color: `url(#${patternId})`,
                  isHatched: true,
                },
              ]
            : []),
        ];

  const totalShares = allSlices.reduce((acc, s) => acc + s.percent, 0) || 100;
  let accumulatedLength = 0;

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Distribusi anggaran: ${coveragePercent}% - ${coverageLabel}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg] overflow-visible"
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

          return (
            <circle
              key={slice.id}
              cx={center}
              cy={center}
              r={radius}
              stroke={slice.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              fill="none"
              className="transition-all duration-500"
            />
          );
        })}
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-mono text-2xl font-bold tracking-tight text-foreground">
          {coveragePercent}%
        </span>
        <span className="text-[10px] font-medium text-secondary tracking-tight">
          {coverageLabel}
        </span>
      </div>
    </div>
  );
}
