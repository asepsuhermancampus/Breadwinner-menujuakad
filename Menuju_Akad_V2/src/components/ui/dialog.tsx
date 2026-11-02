"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/cn";
import styles from "./dialog.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  side?: boolean;
  className?: string | undefined;
};

export function Dialog({ open, onClose, title, children, side = false, className }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!open) {
      if (dialog?.open) dialog.close();
      return;
    }
    const previous = document.activeElement;
    if (!dialog) return;
    const syncVisibility = () => {
      if (dialog.closest("[hidden], [inert]")) {
        if (dialog.open) dialog.close();
      } else if (!dialog.open) {
        dialog.showModal();
      }
    };
    const observer = new MutationObserver(syncVisibility);
    for (let ancestor = dialog.parentElement; ancestor; ancestor = ancestor.parentElement)
      observer.observe(ancestor, { attributes: true, attributeFilter: ["hidden", "inert"] });
    syncVisibility();
    return () => {
      observer.disconnect();
      if (dialog.open) dialog.close();
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    };
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    function trap(event: KeyboardEvent) {
      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const active = document.activeElement;
      const inside = active instanceof HTMLElement && dialog.contains(active);
      if (event.shiftKey && (active === first || !inside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !inside)) {
        event.preventDefault();
        first.focus();
      }
    }
    dialog.addEventListener("keydown", trap);
    return () => dialog.removeEventListener("keydown", trap);
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className={cn(styles.dialog, side && styles.drawer, className)}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <h2 id={titleId} className="text-xl font-semibold leading-none text-foreground">
          {title}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Tutup dialog"
          onClick={onClose}
          className="size-8 shrink-0 rounded-full text-secondary hover:bg-subtle hover:text-foreground"
        >
          <X size={18} aria-hidden="true" />
        </Button>
      </div>
      <div className="mt-5">{children}</div>
    </dialog>
  );
}
