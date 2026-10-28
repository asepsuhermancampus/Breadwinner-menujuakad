"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./profile-access-connector.module.css";
type Geometry = {
  width: number;
  height: number;
  path: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};
export function ProfileAccessConnector({ connected }: { connected: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  useEffect(() => {
    const parent = ref.current?.parentElement;
    const source = parent?.querySelector<HTMLElement>('[data-profile-slot="partner"]');
    const target = parent?.querySelector<HTMLElement>("[data-partner-access-card]");
    if (!parent || !source || !target) return;
    function measure() {
      const root = parent!.getBoundingClientRect(),
        a = source!.getBoundingClientRect(),
        b = target!.getBoundingClientRect();
      if (!root.width || !root.height) return;
      let x1: number, y1: number, x2: number, y2: number, path: string;
      if (b.left >= a.right - 1) {
        x1 = a.right - root.left;
        y1 = a.top + a.height / 2 - root.top;
        x2 = b.left - root.left;
        y2 = b.top + b.height / 2 - root.top;
        path = `M ${x1} ${y1} L ${x2} ${y2}`;
      } else {
        x1 = a.left + a.width / 2 - root.left;
        y1 = a.bottom - root.top;
        x2 = b.left + b.width / 2 - root.left;
        y2 = b.top - root.top;
        const middle = (y1 + y2) / 2;
        path = `M ${x1} ${y1} V ${middle} H ${x2} V ${y2}`;
      }
      const next = { width: root.width, height: root.height, path, x1, y1, x2, y2 };
      setGeometry((previous) =>
        JSON.stringify(previous) === JSON.stringify(next) ? previous : next,
      );
    }
    const observer = new ResizeObserver(measure);
    observer.observe(parent);
    observer.observe(source);
    observer.observe(target);
    const frame = requestAnimationFrame(measure);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <svg
      ref={ref}
      className={styles.connector}
      aria-hidden="true"
      data-profile-connection={connected ? "connected" : "locked"}
      viewBox={geometry ? `0 0 ${geometry.width} ${geometry.height}` : undefined}
    >
      {geometry && (
        <g
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={connected ? 0.7 : 0.4}
        >
          <path d={geometry.path} strokeDasharray={connected ? undefined : "3 3"} />
          <circle cx={geometry.x1} cy={geometry.y1} r="2.5" fill="var(--surface)" />
          <circle cx={geometry.x2} cy={geometry.y2} r="2.5" fill="var(--surface)" />
        </g>
      )}
    </svg>
  );
}
