"use client";

import {
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Icon } from "./icon";
import styles from "./page-heading.module.css";
import { PageHeadingLevel } from "./page-heading-level";

type Props = {
  title: string;
  description: ReactNode;
  id?: string;
  headingClassName?: string;
};

export function PageHeading({ title, description, id, headingClassName }: Props) {
  const level = useContext(PageHeadingLevel);
  const Heading = level === 1 ? "h1" : "h2";
  const [open, setOpen] = useState(false);
  const descriptionId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const positionPopover = () => {
      const group = containerRef.current;
      const popover = popoverRef.current;
      if (!group || !popover) return;
      const groupLeft = group.getBoundingClientRect().left;
      const minLeft = 16 - groupLeft;
      const maxLeft = window.innerWidth - 16 - groupLeft - popover.offsetWidth;
      popover.style.left = `${Math.max(minLeft, Math.min(0, maxLeft))}px`;
    };
    positionPopover();
    window.addEventListener("resize", positionPopover);
    document.addEventListener("scroll", positionPopover, true);
    return () => {
      window.removeEventListener("resize", positionPopover);
      document.removeEventListener("scroll", positionPopover, true);
    };
  }, [open, title]);

  useEffect(() => {
    if (!open) return;
    const dismissOutside = (event: Event) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("focusin", dismissOutside);
    document.addEventListener("keydown", dismissOnEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("focusin", dismissOutside);
      document.removeEventListener("keydown", dismissOnEscape);
    };
  }, [open]);

  return (
    <div className={styles.group} ref={containerRef}>
      <Heading
        id={id}
        className={headingClassName ?? (level === 1 ? styles.title : styles.sectionTitle)}
      >
        {title}
      </Heading>
      <button
        ref={buttonRef}
        type="button"
        className={styles.infoButton}
        aria-label={`Tentang ${title}`}
        aria-expanded={open}
        aria-controls={descriptionId}
        onClick={() => setOpen((current) => !current)}
      >
        <Icon name="info" size={18} />
      </button>
      <div ref={popoverRef} id={descriptionId} className={styles.popover} hidden={!open}>
        {description}
      </div>
    </div>
  );
}
