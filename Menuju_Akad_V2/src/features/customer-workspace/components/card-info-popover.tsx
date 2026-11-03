"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/cn";

export type CardInfoPopoverProps = {
  title: string;
  description: ReactNode;
  className?: string;
  buttonClassName?: string;
};

export function CardInfoPopover({
  title,
  description,
  className,
  buttonClassName,
}: CardInfoPopoverProps) {
  const [open, setOpen] = useState(false);
  const popoverId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative inline-flex items-center", className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Informasi tentang ${title}`}
        aria-expanded={open}
        aria-controls={popoverId}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "inline-flex items-center justify-center w-5 h-5 rounded-full text-secondary hover:text-foreground hover:bg-subtle/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer",
          open && "text-foreground bg-subtle/80",
          buttonClassName,
        )}
      >
        <Info size={13} className="shrink-0" />
      </button>

      {open && (
        <div
          id={popoverId}
          role="region"
          aria-live="polite"
          className="absolute left-0 top-full mt-1.5 z-40 w-64 sm:w-72 p-3 rounded-lg border border-ux-border bg-surface text-secondary text-xs shadow-lg space-y-1 animate-in fade-in zoom-in-95 duration-150"
        >
          <p className="font-semibold text-foreground text-xs">{title}</p>
          <div className="text-[11px] leading-relaxed text-secondary">{description}</div>
        </div>
      )}
    </div>
  );
}

