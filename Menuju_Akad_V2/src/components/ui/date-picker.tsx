"use client";

import { useState, useRef, useEffect, useId } from "react";
import { DayPicker } from "react-day-picker";
import { format, addDays } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { parseDateValue, formatDateValue } from "./date-picker-utils";
import "react-day-picker/style.css";

export type DatePickerProps = {
  label?: string;
  value?: string;
  onChange?: (formattedValue: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
};

export { parseDateValue, formatDateValue };

export function DatePicker({
  label,
  value,
  onChange,
  error,
  hint,
  placeholder = "Pilih tenggat waktu...",
  disabled = false,
  className,
  id: customId,
}: DatePickerProps) {
  const generatedId = useId();
  const fieldId = customId ?? generatedId;
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);

  const selectedDate = parseDateValue(value);

  const toggleOpen = () => {
    if (disabled) return;
    if (!open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 350 && rect.top > 300);
    }
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      const formatted = formatDateValue(date);
      onChange?.(formatted);
      setOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.("");
  };

  const displayLabel = selectedDate
    ? format(selectedDate, "EEEE, d MMMM yyyy", { locale: idLocale })
    : value || placeholder;

  return (
    <div ref={containerRef} className={cn("relative grid min-w-0 gap-1.5", className)}>
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        id={fieldId}
        type="button"
        disabled={disabled}
        onClick={toggleOpen}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          "flex min-h-11 w-full items-center justify-between rounded-control border border-ux-border bg-surface px-3.5 py-2.5 text-left text-sm transition focus-visible:outline-2 focus-visible:outline-primary",
          error && "border-danger",
          disabled && "cursor-not-allowed opacity-60",
          !selectedDate && !value && "text-muted",
        )}
      >
        <div className="flex items-center gap-2.5 truncate">
          <CalendarIcon size={16} className="shrink-0 text-primary" />
          <span className="truncate">{displayLabel}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleClear(e as unknown as React.MouseEvent);
              }}
              aria-label="Hapus tanggal"
              className="rounded p-1 text-muted transition hover:bg-subtle hover:text-foreground"
            >
              <X size={14} />
            </span>
          )}
        </div>
      </button>

      {/* Floating Popover Calendar */}
      {open && (
        <div
          className={cn(
            "absolute left-0 z-50 w-auto rounded-2xl border border-ux-border bg-surface p-3.5 shadow-2xl animate-in fade-in-50 zoom-in-95",
            openUpward ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]",
          )}
        >
          {/* Quick Presets */}
          <div className="mb-2.5 flex items-center gap-1.5 border-b border-ux-border pb-2.5 text-xs">
            <button
              type="button"
              onClick={() => handleSelect(new Date())}
              className="rounded-lg border border-ux-border bg-subtle px-2.5 py-1 text-xs font-medium text-primary transition hover:bg-primary hover:text-white"
            >
              Hari ini
            </button>
            <button
              type="button"
              onClick={() => handleSelect(addDays(new Date(), 1))}
              className="rounded-lg border border-ux-border bg-subtle px-2.5 py-1 text-xs font-medium text-primary transition hover:bg-primary hover:text-white"
            >
              Besok
            </button>
            <button
              type="button"
              onClick={() => handleSelect(addDays(new Date(), 7))}
              className="rounded-lg border border-ux-border bg-subtle px-2.5 py-1 text-xs font-medium text-primary transition hover:bg-primary hover:text-white"
            >
              1 Minggu
            </button>
          </div>

          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            locale={idLocale}
            className="m-0 font-sans"
            modifiersClassNames={{
              selected: "!bg-primary !text-white font-bold rounded-lg",
              today: "font-bold text-primary underline underline-offset-4",
            }}
          />
        </div>
      )}

      {(error || hint) && (
        <p className={cn("text-xs", error ? "text-danger" : "text-secondary")}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
