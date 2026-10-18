"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { analyticsFixture } from "../content/manager-content";
import { analyticsCsv } from "../domain/analytics-export";

export function useAnalyticsRange() {
  const [range, setRange] = useState("current");
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<"loading" | "ready" | "empty" | "error">("loading");
  useEffect(() => {
    const timer = setTimeout(() => {
      setState(!navigator.onLine ? "error" : range === "current" ? "ready" : "empty");
    }, 150);
    return () => clearTimeout(timer);
  }, [range, attempt]);
  return {
    range,
    state,
    choose: (value: string) => {
      setState("loading");
      setRange(value);
    },
    retry: () => {
      setState("loading");
      setAttempt((value) => value + 1);
    },
  };
}

export function AnalyticsControls({
  range,
  state,
  choose,
  retry,
}: ReturnType<typeof useAnalyticsRange>) {
  function download() {
    const url = URL.createObjectURL(
      new Blob([analyticsCsv(analyticsFixture)], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "analitik-agregat-19-25-okt-2026.csv";
    link.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <label className="grid gap-1.5 text-xs font-semibold">
          Rentang analitik
          <select
            value={range}
            onChange={(event) => choose(event.target.value)}
            className="min-h-11 rounded-control border border-border bg-surface px-3 text-sm"
          >
            <option value="current">19–25 Okt 2026</option>
            <option value="previous">12–18 Okt 2026</option>
          </select>
        </label>
        <Button variant="secondary" disabled={state !== "ready"} onClick={download}>
          Ekspor agregat CSV
        </Button>
      </div>
      {state === "loading" && (
        <p role="status" className="text-sm text-secondary">
          Memuat analitik simulasi…
        </p>
      )}
      {state === "empty" && (
        <p role="status" className="text-sm text-secondary">
          Belum ada data pada rentang ini. Pilih 19–25 Okt untuk melihat data simulasi.
        </p>
      )}
      {state === "error" && (
        <div className="grid gap-2">
          <p role="alert" className="text-sm text-danger">
            Analitik belum dapat dimuat saat offline.
          </p>
          <Button variant="secondary" onClick={retry}>
            Coba lagi
          </Button>
        </div>
      )}
      {state !== "ready" && (
        <p className="text-xs text-secondary">Ekspor tersedia setelah data berhasil dimuat.</p>
      )}
    </div>
  );
}
