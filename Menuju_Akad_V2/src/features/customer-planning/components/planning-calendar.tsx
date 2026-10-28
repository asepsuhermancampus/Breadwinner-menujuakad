"use client";
import { useState } from "react";
import type { PlanningViewProps } from "../domain/planning-view";
import calendar from "@/features/planner-calendar/components/calendar.module.css";
import styles from "./planning.module.css";
export function PlanningCalendar({ items, edit, remove }: PlanningViewProps) {
  const events = items.filter((item) => "date" in item);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [mode, setMode] = useState("Bulan");
  const [day, setDay] = useState(() => new Date().toISOString().slice(0, 10));
  const year = Number(month.slice(0, 4)),
    index = Number(month.slice(5)) - 1;
  const first = new Date(Date.UTC(year, index, 1));
  const offset = (first.getUTCDay() + 6) % 7;
  const count = Math.ceil((offset + new Date(Date.UTC(year, index + 1, 0)).getUTCDate()) / 7) * 7;
  const dates = Array.from({ length: count }, (_, i) =>
    new Date(Date.UTC(year, index, 1 - offset + i)).toISOString().slice(0, 10),
  );
  const selectedIndex = dates.indexOf(day);
  const week = Math.floor(Math.max(0, selectedIndex) / 7);
  const shown = mode === "Bulan" ? dates : dates.slice(week * 7, week * 7 + 7);
  const selected = events.filter((item) => item.date === day);
  function moveMonth(delta: number) {
    const next = new Date(Date.UTC(year, index + delta, 1)).toISOString().slice(0, 10);
    setMonth(next.slice(0, 7));
    setDay(next);
  }
  return (
    <div className={styles.split}>
      <div className={styles.stack}>
        <div className={styles.row}>
          <div className={styles.actions}>
            <button onClick={() => moveMonth(-1)} aria-label="Bulan sebelumnya">
              ←
            </button>
            <label className="text-sm font-semibold">
              <span className="sr-only">Bulan kalender</span>
              <input
                type="month"
                value={month}
                onChange={(e) => {
                  if (e.target.value) {
                    setMonth(e.target.value);
                    setDay(`${e.target.value}-01`);
                  }
                }}
              />
            </label>
            <button onClick={() => moveMonth(1)} aria-label="Bulan berikutnya">
              →
            </button>
            <button
              onClick={() => {
                const now = new Date().toISOString().slice(0, 10);
                setDay(now);
                setMonth(now.slice(0, 7));
              }}
            >
              Hari ini
            </button>
          </div>
          <div className={styles.tabs} role="tablist" aria-label="Tampilan kalender">
            {["Bulan", "Minggu"].map((value) => (
              <button
                key={value}
                role="tab"
                aria-selected={mode === value}
                onClick={() => setMode(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div className="app-scroll overflow-x-auto">
          <div className={`${calendar.grid} min-w-[560px]`}>
            {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((value) => (
              <div key={value} className={calendar.weekdayHeader}>
                {value}
              </div>
            ))}
            {shown.map((date) => (
              <div
                key={date}
                className={`${calendar.dayCell} ${date.slice(0, 7) !== month ? "opacity-50" : ""}`}
              >
                <button
                  aria-label={`Jadwal ${date}`}
                  aria-pressed={day === date}
                  onClick={() => setDay(date)}
                  className={`${calendar.dayNum} min-h-11 text-left ${day === date ? "font-bold underline" : ""}`}
                >
                  {Number(date.slice(-2))}
                </button>
                {events
                  .filter((item) => item.date === date)
                  .map((event) => (
                    <button
                      key={event.id}
                      onClick={() => {
                        setDay(date);
                      }}
                      className={`${calendar.eventBadge} bg-primary/10 text-brand-secondary text-left`}
                    >
                      <span className="block font-mono">{event.startTime}</span>
                      {event.title}
                    </button>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <aside className={`${styles.card} ${styles.subtle} ${styles.stack}`}>
        <h2 className="text-sm font-semibold">
          {new Intl.DateTimeFormat("id-ID", { dateStyle: "full", timeZone: "UTC" }).format(
            new Date(`${day}T00:00:00Z`),
          )}
        </h2>
        {selected.length ? (
          selected.map((item) => (
            <article key={item.id} className={styles.stack}>
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <p className="font-mono text-xs">
                {item.startTime}–{item.endTime} WIB
              </p>
              {item.notes && (
                <p className="text-xs text-secondary whitespace-pre-wrap">{item.notes}</p>
              )}
              <div className={styles.actions}>
                <button onClick={() => edit(item)}>Lihat detail jadwal</button>
                <button data-delete onClick={() => remove(item)}>
                  Hapus
                </button>
              </div>
            </article>
          ))
        ) : (
          <p className="text-xs text-secondary">Belum ada jadwal pada hari ini.</p>
        )}
      </aside>
    </div>
  );
}
