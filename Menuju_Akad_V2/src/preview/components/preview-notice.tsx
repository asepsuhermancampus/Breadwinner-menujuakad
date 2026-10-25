"use client";
import Link from "next/link";
import { useState } from "react";
import type { MockScenario } from "../adapters/mock-runtime";

export function PreviewNotice() {
  const [mode, setMode] = useState<MockScenario>("ready");
  return (
    <aside
      aria-label="Pratinjau development"
      className="flex min-h-8 flex-wrap items-center justify-center gap-x-4 gap-y-1 border-b border-ux-border bg-ux-dock px-3 py-1.5 text-[10px] text-secondary"
    >
      <span>
        PRATINJAU LOKAL · Data contoh · OTP simulasi <strong className="font-mono">882016</strong> ·
        Tanpa pengiriman OTP nyata
      </span>
      <details className="relative">
        <summary className="cursor-pointer">Skenario uji</summary>
        <div className="absolute right-0 z-50 mt-2 grid min-w-56 gap-3 rounded-control border border-border bg-surface p-4 shadow-lg">
          <label htmlFor="mock-scenario">Kondisi adapter</label>
          <select
            id="mock-scenario"
            value={mode}
            className="min-h-11 rounded-control border border-border px-2"
            onChange={(event) => {
              const value = event.target.value as MockScenario;
              sessionStorage.setItem("ma-v2-scenario", value);
              setMode(value);
            }}
          >
            <option value="ready">Normal</option>
            <option value="offline">Offline</option>
            <option value="revoked">Akses dicabut</option>
            <option value="conflict">Versi berubah</option>
          </select>
          <Link href="/auth/login" className="min-h-11 py-3">
            Kembali ke masuk
          </Link>
          <button
            className="min-h-11 rounded-control bg-subtle px-3"
            onClick={() => {
              ["ma-v2-account", "ma-v2-account-deleted", "ma-v2-workspace"].forEach((key) =>
                localStorage.removeItem(key),
              );
              sessionStorage.removeItem("ma-v2-scenario");
              window.location.reload();
            }}
          >
            Reset data contoh lokal
          </button>
        </div>
      </details>
    </aside>
  );
}
