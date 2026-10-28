"use client";

import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
};
export function Field({ label, error, hint, className, id, ...props }: Props) {
  const generated = useId();
  const fieldId = id ?? generated;
  const described = error || hint ? `${fieldId}-description` : undefined;
  return (
    <div className="grid min-w-0 gap-2">
      <label htmlFor={fieldId} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={described}
        className={cn(
          "min-h-11 w-full rounded-control border border-control-border bg-surface px-3.5 py-3 text-sm placeholder:text-secondary",
          error && "border-danger",
          className,
        )}
        {...props}
      />
      {described && (
        <p
          id={described}
          className={cn("text-xs leading-relaxed", error ? "text-danger" : "text-secondary")}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
