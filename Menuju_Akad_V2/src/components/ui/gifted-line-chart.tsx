"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

export type GiftedLinePoint = {
  label: string;
  value: number;
};

export type GiftedLineChartProps = {
  data: GiftedLinePoint[];
  height?: number;
  className?: string;
  lineColor?: string;
  gradientColors?: [string, string];
  unit?: string;
};

/**
 * GiftedLineChart
 * Komponen Line / Area Chart kurva halus bergaya khas Gifted Charts:
 * - Kurva Bezier halus (smooth S-curve)
 * - Area gradient lembut di bawah garis
 * - Data points melingkar (pulsing/accent dots)
 * - Nilai numerik di atas setiap titik
 * - Garis kisi putus-putus (dashed horizontal gridlines)
 */
export function GiftedLineChart({
  data,
  height = 150,
  className,
  lineColor = "#10b981",
  gradientColors = ["rgba(16, 185, 129, 0.28)", "rgba(16, 185, 129, 0.0)"],
  unit = "",
}: GiftedLineChartProps) {
  const chartId = useId().replace(/:/g, "_");
  const areaGradId = `${chartId}-area-grad`;

  const padLeft = 46;
  const padRight = 24;
  const padTop = 22;
  const padBottom = 26;

  const rawMax = Math.max(...data.map((d) => d.value), 0);
  const maxDisplay = Math.max(rawMax, 3);
  const gridSteps = [maxDisplay, Math.round(maxDisplay * 0.66), Math.round(maxDisplay * 0.33), 0];

  const totalPoints = data.length;
  const chartWidth = 320; // relative SVG viewBox width
  const usableWidth = chartWidth - padLeft - padRight;
  const usableHeight = height - padTop - padBottom;
  const baselineY = padTop + usableHeight;

  // Calculate coordinates
  const coords = data.map((d, i) => {
    const x =
      totalPoints > 1
        ? padLeft + (i / (totalPoints - 1)) * usableWidth
        : padLeft + usableWidth / 2;
    const ratio = rawMax > 0 ? Math.max(0, Math.min(1, d.value / maxDisplay)) : 0;
    const y = baselineY - ratio * usableHeight;
    return { x, y, value: d.value, label: d.label };
  });

  // Build smooth Bezier path
  let pathD = "";
  if (coords.length > 0) {
    pathD = `M ${coords[0]!.x} ${coords[0]!.y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i]!;
      const next = coords[i + 1]!;
      const cpX = (curr.x + next.x) / 2;
      pathD += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
    }
  }

  // Build closed area path for gradient
  let areaD = "";
  if (coords.length > 0 && pathD) {
    const first = coords[0]!;
    const last = coords[coords.length - 1]!;
    areaD = `${pathD} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
  }

  return (
    <div className={cn("w-full pt-2 flex flex-col justify-end", className)}>
      <div className="relative w-full" style={{ height }}>
        <svg
          viewBox={`0 0 ${chartWidth} ${height}`}
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id={areaGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={gradientColors[0]} />
              <stop offset="100%" stopColor={gradientColors[1]} />
            </linearGradient>
          </defs>

          {/* Gridlines */}
          {gridSteps.map((stepVal, idx) => {
            const y = padTop + (idx / (gridSteps.length - 1)) * usableHeight;
            return (
              <g key={idx}>
                <text
                  x={padLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="font-mono text-[9px] fill-muted-foreground/70"
                >
                  {stepVal}
                </text>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={chartWidth - padRight + 8}
                  y2={y}
                  stroke="currentColor"
                  className="text-ux-border/60"
                  strokeDasharray="3 3"
                  strokeWidth="0.8"
                />
              </g>
            );
          })}

          {/* Area Fill */}
          {areaD && <path d={areaD} fill={`url(#${areaGradId})`} />}

          {/* Stroke Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={lineColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Dots & Labels */}
          {coords.map((pt, idx) => (
            <g key={idx} className="group cursor-pointer">
              {/* Outer Glow / Halo */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r="6"
                fill={lineColor}
                opacity="0.18"
                className="transition-transform duration-200 group-hover:scale-150"
              />
              {/* Inner Dot */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r="3.5"
                fill="var(--canvas, #ffffff)"
                stroke={lineColor}
                strokeWidth="2"
              />
              {/* Value on top of dot (only show if > 0 or on hover) */}
              {pt.value > 0 && (
                <text
                  x={pt.x}
                  y={pt.y - 8}
                  textAnchor="middle"
                  className="font-mono text-[10px] font-bold fill-foreground"
                >
                  {pt.value}
                  {unit}
                </text>
              )}
              {/* X-axis label below baseline */}
              <text
                x={pt.x}
                y={baselineY + 14}
                textAnchor="middle"
                className="text-[10px] font-medium fill-secondary"
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
