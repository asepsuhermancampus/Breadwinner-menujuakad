"use client";
import { useUrlTab } from "@/hooks/use-url-tab";
import { useState } from "react";
import type { CalendarEventItem } from "../types/calendar";
import {
  generateOctoberGrid,
  getWeekDays,
  getWeekRangeLabel,
  TOTAL_WEEKS,
  DEFAULT_WEEK_INDEX,
} from "../utils/calendar-grid";
import { CalendarNav } from "./calendar-nav";
import styles from "./calendar.module.css";

type Props = {
  initialEvents: CalendarEventItem[];
};

export function CalendarScreen({ initialEvents }: Props) {
  const [viewMode, setViewMode] = useUrlTab("tab", ["Bulan", "Minggu"], "Bulan");
  const [weekIndex, setWeekIndex] = useState(DEFAULT_WEEK_INDEX);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventItem | null>(null);

  const allDays = generateOctoberGrid(initialEvents);
  const weekDays = getWeekDays(allDays, weekIndex);
  const displayDays = viewMode === "Bulan" ? allDays : weekDays;

  return (
    <main id="main-content" className={styles.container}>
      <header>
        <h1 className="font-sans text-3xl font-semibold text-brand-secondary tracking-[-0.9px]">
          Kalender koordinasi
        </h1>
        <p className="text-sm text-secondary">
          Semua fitting, pertemuan vendor, dan tenggat dalam satu tempat.
        </p>
      </header>

      <div className={styles.calendarCard}>
        <div className={styles.headerRow}>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-foreground">Oktober 2026</h2>
            <span className="rounded-full bg-ux-dock border border-ux-border px-2.5 py-0.5 text-xs text-secondary font-mono">
              WIB
            </span>
            {viewMode === "Minggu" && (
              <CalendarNav
                weekIndex={weekIndex}
                totalWeeks={TOTAL_WEEKS}
                rangeLabel={getWeekRangeLabel(weekDays)}
                onPrev={() => setWeekIndex((prev) => Math.max(0, prev - 1))}
                onNext={() => setWeekIndex((prev) => Math.min(TOTAL_WEEKS - 1, prev + 1))}
              />
            )}
          </div>

          <div
            className="flex gap-1.5 rounded-control bg-ux-dock border border-ux-border p-1"
            role="tablist"
          >
            {(["Bulan", "Minggu"] as const).map((mode) => (
              <button
                key={mode}
                role="tab"
                aria-selected={viewMode === mode}
                className={`customer-control rounded-control px-3.5 py-1 text-xs font-medium transition ${
                  viewMode === mode
                    ? "bg-surface text-brand-secondary shadow-sm font-semibold"
                    : "text-secondary hover:text-foreground"
                }`}
                onClick={() => setViewMode(mode)}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day) => (
            <div key={day} className={styles.weekdayHeader}>
              {day}
            </div>
          ))}

          {displayDays.map((cell, idx) => (
            <div
              key={idx}
              className={`${styles.dayCell} ${!cell.isCurrentMonth ? "bg-subtle/40" : ""}`}
            >
              <span
                className={`${styles.dayNum} ${
                  cell.dateStr === "2026-10-25"
                    ? "font-bold text-brand-secondary underline"
                    : !cell.isCurrentMonth
                      ? "text-muted"
                      : ""
                }`}
              >
                {cell.dayNumber}
              </span>

              {cell.events.map((evt) => (
                <button
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className={`${styles.eventBadge} text-left font-medium ${
                    evt.type === "fitting"
                      ? "bg-champagne/20 text-foreground"
                      : evt.type === "deadline"
                        ? "bg-rose/15 text-rose"
                        : "bg-primary/10 text-brand-secondary"
                  }`}
                >
                  <span className="block font-mono text-[9px]">{evt.time}</span>
                  <span className="truncate block">{evt.title}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {selectedEvent && (
        <div
          className="rounded-none border border-border bg-surface p-4 flex flex-wrap items-center justify-between gap-4"
          role="region"
          aria-label="Detail janji temu terpilih"
        >
          <div className="space-y-1">
            <span className="text-xs text-secondary font-mono">
              {selectedEvent.date} · {selectedEvent.time} WIB
            </span>
            <h3 className="text-sm font-semibold text-foreground">{selectedEvent.title}</h3>
            <p className="text-xs text-secondary">
              Lokasi: {selectedEvent.venue} · PIC: {selectedEvent.pic}
            </p>
          </div>
          <button
            onClick={() => setSelectedEvent(null)}
            className="customer-control text-xs text-secondary hover:text-foreground"
          >
            Tutup rincian ✕
          </button>
        </div>
      )}
    </main>
  );
}
