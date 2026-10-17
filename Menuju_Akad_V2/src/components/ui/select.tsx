"use client";

import { useId, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
};
export function Select({ label, id, error, hint, className, children, ...props }: Props) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <div className="grid min-w-0 gap-2">
      <label htmlFor={fieldId} className="text-sm font-medium">
        {label}
      </label>
      <select
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? `${fieldId}-description` : undefined}
        className={cn(
          "min-h-11 w-full rounded-control border border-border bg-surface px-3 py-3 text-sm",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {(error || hint) && (
        <p
          id={`${fieldId}-description`}
          className={cn("text-xs", error ? "text-danger" : "text-secondary")}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
