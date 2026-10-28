"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EllipsisVertical } from "lucide-react";
import styles from "./document-card-actions.module.css";
type Action = { label: string; disabled: boolean; run: () => void };
export function DocumentActionMenu({
  id,
  label,
  actions,
}: {
  id: string;
  label: string;
  actions: Action[];
}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null),
    menu = useRef<HTMLDivElement>(null);
  const positionMenu = useCallback(() => {
    const bounds = trigger.current?.getBoundingClientRect(),
      popup = menu.current;
    if (!bounds || !popup) return;
    popup.style.top = `${Math.max(12, Math.min(bounds.bottom + 6, window.innerHeight - popup.offsetHeight - 12))}px`;
    popup.style.left = `${Math.max(12, Math.min(bounds.right - 200, window.innerWidth - 212))}px`;
  }, []);
  useLayoutEffect(() => {
    if (!open) return;
    positionMenu();
    menu.current?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();
  }, [open, positionMenu]);
  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (
        event.target instanceof Node &&
        !menu.current?.contains(event.target) &&
        !trigger.current?.contains(event.target)
      )
        setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("focusin", close);
    window.addEventListener("resize", positionMenu);
    document.addEventListener("scroll", positionMenu, true);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("focusin", close);
      window.removeEventListener("resize", positionMenu);
      document.removeEventListener("scroll", positionMenu, true);
    };
  }, [open, positionMenu]);
  return (
    <>
      <button
        ref={trigger}
        id={id}
        type="button"
        className={styles.trigger}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${id}-menu` : undefined}
        disabled={actions.every((action) => action.disabled)}
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <EllipsisVertical aria-hidden="true" size={18} />
      </button>
      {open &&
        createPortal(
          <div
            ref={menu}
            id={`${id}-menu`}
            role="menu"
            aria-label={label}
            className={styles.menu}
            onKeyDown={(event) => {
              const buttons = [
                ...(menu.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ??
                  []),
              ];
              const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
              if (event.key === "Escape" || event.key === "Tab") {
                if (event.key === "Escape") {
                  event.preventDefault();
                  trigger.current?.focus();
                }
                setOpen(false);
              } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
                event.preventDefault();
                const next =
                  event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? buttons.length - 1
                      : (index + (event.key === "ArrowUp" ? -1 : 1) + buttons.length) %
                        buttons.length;
                buttons[next]?.focus();
              }
            }}
          >
            {actions.map((action) => (
              <button
                key={action.label}
                role="menuitem"
                type="button"
                disabled={action.disabled}
                onClick={() => {
                  setOpen(false);
                  trigger.current?.focus();
                  action.run();
                }}
              >
                {action.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
