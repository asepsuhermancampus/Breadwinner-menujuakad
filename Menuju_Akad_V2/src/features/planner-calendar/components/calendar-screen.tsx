"use client";
import { useState } from "react";
import type { CalendarEventItem } from "../types/calendar";
import styles from "./calendar.module.css";

type Props = {
  initialEvents: CalendarEventItem[];
};

export function CalendarScreen({ initialEvents }: Props) {
  const [viewMode, setViewMode] = useState<"Bulan" | "Minggu">("Bulan");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventItem | null>(null);

  const daysInOctober = Array.from({ length: 35 }, (_, index) => {
    // Week starts Monday. 1 Oct 2026 is Thursday.
    // Days 28-30 are Sept, 1-31 are Oct, 1 is Nov.
    const dayNumber = index < 3 ? 28 + index : index < 34 ? index - 2 : 1;
    const isCurrentMonth = index >= 3 && index < 34;
    const dateStr = isCurrentMonth
      ? `2026-10-${String(dayNumber).padStart(2, "0")}`
      : index < 3
        ? `2026-09-${String(dayNumber).padStart(2, "0")}`
        : `2026-11-01`;

    const dayEvents = initialEvents.filter((e) => e.date === dateStr);
    return { dayNumber, isCurrentMonth, dateStr, events: dayEvents };
  });

  return (
    <main id="main-content" className={styles.container}>
      <header>
        <h1 className="font-serif text-3xl text-foreground">Kalender koordinasi</h1>
        <p className="text-sm text-secondary">
          Semua fitting, pertemuan vendor, dan tenggat dalam satu tempat.
        </p>
      </header>

      <div className={styles.calendarCard}>
        <div className={styles.headerRow}>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-foreground">Oktober 2026</h2>
            <span className="rounded-full bg-subtle px-2.5 py-0.5 text-xs text-secondary font-mono">
              WIB
            </span>
          </div>

          <div className="flex gap-1 rounded-control bg-subtle p-1" role="tablist">
            {(["Bulan", "Minggu"] as const).map((mode) => (
              <button
                key={mode}
                role="tab"
                aria-selected={viewMode === mode}
                className={`rounded-control px-3 py-1 text-xs font-medium transition ${
                  viewMode === mode
                    ? "bg-surface text-primary shadow-sm"
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

          {daysInOctober.map((cell, idx) => (
            <div
              key={idx}
              className={`${styles.dayCell} ${!cell.isCurrentMonth ? "bg-subtle/40" : ""}`}
            >
              <span
                className={`${styles.dayNum} ${
                  cell.dateStr === "2026-10-25"
                    ? "font-bold text-primary underline"
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
                        : "bg-primary/10 text-primary"
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
          className="rounded-card border border-border bg-surface p-4 flex flex-wrap items-center justify-between gap-4"
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
            className="text-xs text-secondary hover:text-foreground"
          >
            Tutup rincian ✕
          </button>
        </div>
      )}
    </main>
  );
}
