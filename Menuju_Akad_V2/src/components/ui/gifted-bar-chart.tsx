"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

export type GiftedBarItem = {
  label: string;
  value: number;
  total?: number;
  color?: string;
  gradient?: [string, string];
};

export type GiftedBarChartProps = {
  data: GiftedBarItem[];
  height?: number;
  barWidth?: number;
  className?: string;
  unit?: string;
};

/**
 * GiftedBarChart
 * Komponen Bar Chart vertikal bergaya signature Gifted Charts
 * dengan rounded bar caps, subtle horizontal gridlines, dan label nilai di atas bar.
 */
export function GiftedBarChart({
  data,
  height = 160,
  barWidth = 32,
  className,
  unit = "",
}: GiftedBarChartProps) {
  const gradientPrefix = useId().replace(/:/g, "_");
  const rawMax = Math.max(...data.map((d) => d.total ?? d.value), 0);
  const maxDisplay = Math.max(rawMax, 3);
  const gridSteps = [maxDisplay, Math.round(maxDisplay * 0.66), Math.round(maxDisplay * 0.33), 0];

  return (
    <div className={cn("w-full flex flex-col justify-end pt-4", className)}>
      {/* Chart Canvas with Gridlines & Bars */}
      <div className="relative w-full" style={{ height }}>
        {/* Subtle Horizontal Reference Gridlines (Gifted Charts signature) */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {gridSteps.map((stepValue, idx) => (
            <div key={idx} className="w-full flex items-center gap-2">
              <span className="font-mono text-[10px] text-muted-foreground/60 w-6 text-right shrink-0">
                {stepValue}
              </span>
              <div className="w-full border-b border-dashed border-ux-border/60" />
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div className="absolute inset-0 pl-8 pr-2 flex items-end justify-around">
          {data.map((item, index) => {
            const ratio = rawMax > 0 ? Math.max(0, Math.min(1, item.value / maxDisplay)) : 0;
            const barHeight =
              item.value > 0 ? Math.max(12, Math.round(ratio * (height - 28))) : 4;
            const gradId = `${gradientPrefix}-bar-${index}`;
            const colors = item.gradient ?? ["#065f46", "#10b981"];

            return (
              <div
                key={item.label}
                className="flex flex-col items-center group relative h-full justify-end"
                style={{ width: barWidth }}
              >
                {/* Value on top of bar */}
                <span className="font-mono text-xs font-semibold text-foreground mb-1.5 transition-transform group-hover:scale-110">
                  {item.value}
                  {unit}
                </span>

                {/* SVG Bar with Rounded Top */}
                <svg
                  width={barWidth}
                  height={barHeight}
                  viewBox={`0 0 ${barWidth} ${barHeight}`}
                  className="overflow-visible"
                >
                  <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colors[1]} />
                      <stop offset="100%" stopColor={colors[0]} />
                    </linearGradient>
                  </defs>
                  {/* Track Bar Background (Gifted Charts backdrop) */}
                  <rect
                    x="0"
                    y="0"
                    width={barWidth}
                    height={barHeight}
                    rx="4"
                    fill={item.value > 0 ? `url(#${gradId})` : "currentColor"}
                    className={cn(
                      "transition-all duration-300",
                      item.value > 0
                        ? "group-hover:brightness-110"
                        : "text-ux-border/40"
                    )}
                  />
                </svg>
              </div>
            );
          })}
        </div>
      </div>

      {/* X-Axis Labels */}
      <div className="pl-8 pr-2 flex justify-around border-t border-ux-border/80 pt-2 mt-1">
        {data.map((item) => (
          <div
            key={item.label}
            className="text-center font-medium text-xs text-secondary truncate"
            style={{ width: barWidth * 2 }}
            title={item.label}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
