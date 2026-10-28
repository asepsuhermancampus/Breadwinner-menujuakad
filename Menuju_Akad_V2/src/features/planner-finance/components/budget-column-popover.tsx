"use client";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/icon";
import styles from "./budget-column-controls.module.css";
export function BudgetColumnPopover({
  label,
  active,
  children,
}: {
  label: string;
  active: boolean;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null),
    popup = useRef<HTMLDivElement>(null);
  const id = useId();
  const wasOpen = useRef(false);
  const position = useCallback(() => {
    const box = trigger.current?.getBoundingClientRect(),
      panel = popup.current;
    if (!box || !panel) return;
    panel.style.left = `${Math.max(12, Math.min(box.left, innerWidth - panel.offsetWidth - 12))}px`;
    panel.style.top = `${Math.max(12, Math.min(box.bottom + 8, innerHeight - panel.offsetHeight - 12))}px`;
  }, []);
  const close = () => {
    setOpen(false);
  };
  useLayoutEffect(() => {
    if (!open) {
      if (wasOpen.current) trigger.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    position();
    popup.current?.querySelector<HTMLElement>('[role="radio"][tabindex="0"]')?.focus();
  }, [open, position]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: Event) => {
      if (
        event.target instanceof Node &&
        !popup.current?.contains(event.target) &&
        !trigger.current?.contains(event.target)
      ) {
        wasOpen.current = false;
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    document.addEventListener("scroll", position, true);
    window.addEventListener("resize", position);
    const observer = new ResizeObserver(position);
    if (popup.current) observer.observe(popup.current);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
      document.removeEventListener("scroll", position, true);
      window.removeEventListener("resize", position);
      observer.disconnect();
    };
  }, [open, position]);
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={`${styles.trigger} ${active ? styles.active : ""}`}
        aria-label={`Filter ${label}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen(!open)}
      >
        {label}
        <span aria-hidden="true">
          <Icon name="filter" size={13} />
        </span>
      </button>
      {open &&
        createPortal(
          <div
            id={id}
            ref={popup}
            className={styles.popup}
            role="dialog"
            aria-label={`Filter ${label}`}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                close();
              }
            }}
          >
            <header>
              <strong>{label}</strong>
              <button type="button" aria-label="Tutup pengaturan kolom" onClick={close}>
                <Icon name="x" size={16} />
              </button>
            </header>
            {children(close)}
          </div>,
          document.body,
        )}
    </>
  );
}
