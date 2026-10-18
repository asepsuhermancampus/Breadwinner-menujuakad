import type { ReactNode } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

const status = cva("rounded-control px-4 py-3 text-xs leading-relaxed", {
  variants: {
    tone: {
      info: "bg-ux-dock text-secondary border border-ux-border",
      success: "bg-success-bg text-success border border-success/20",
      danger: "bg-danger-bg text-danger border border-danger/20",
      warning: "bg-ux-warm text-ux-gold-ink border border-ux-border",
    },
  },
  defaultVariants: { tone: "info" },
});
export function Status({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "success" | "danger" | "warning";
}) {
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn(status({ tone }))}>
      {children}
    </div>
  );
}
