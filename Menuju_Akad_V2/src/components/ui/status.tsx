import type { ReactNode } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

const status = cva("rounded-control px-4 py-3 text-xs leading-relaxed", {
  variants: {
    tone: {
      info: "bg-subtle text-secondary",
      success: "bg-success-bg text-success",
      danger: "bg-danger-bg text-danger",
      warning: "bg-warning-bg text-warning",
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
