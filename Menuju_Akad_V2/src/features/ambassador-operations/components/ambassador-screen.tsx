"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { createAmbassadorContext, createAmbassadorState } from "../content/ambassador-content";
import type { AmbassadorResult } from "../types/ambassador";
import { AmbassadorRecruitment } from "./ambassador-recruitment";
import { AmbassadorLedger } from "./ambassador-ledger";
import { AmbassadorWithdrawal } from "./ambassador-withdrawal";

export type AmbassadorView = "recruitment" | "ledger" | "withdrawal";

export function AmbassadorScreen({ view = "recruitment" }: { view?: AmbassadorView }) {
  const [userSelectedView, setUserSelectedView] = useState<AmbassadorView | null>(null);
  const currentView = userSelectedView ?? view;
  const [state, setState] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("ma-ambassador-state-v1:sinta");
        if (raw) return JSON.parse(raw);
      } catch {}
    }
    return createAmbassadorState();
  });
  const [scenario, setScenario] = useState("ready");
  const [message, setMessage] = useState("");
  const [review, setReview] = useState(view === "withdrawal");

  const context = createAmbassadorContext(state);
  if (scenario === "offline") context.online = false;
  if (scenario === "expired") context.sessionValid = false;
  if (scenario === "revoked")
    context.permissions = {
      withdraw: false,
      referralCopy: false,
      export: false,
      attributionWrite: false,
    };
  if (scenario === "stale") context.latestVersion += 1;
  if (scenario === "dispute") context.disputed = true;
  if (scenario === "hidden") context.sandbox = false;

  function commit(result: AmbassadorResult) {
    setMessage(result.message);
    if (result.ok) {
      setState(result.state);
      try {
        localStorage.setItem("ma-ambassador-state-v1:sinta", JSON.stringify(result.state));
        const last = result.state.withdrawals[result.state.withdrawals.length - 1];
        if (last) {
          void fetch("/api/ambassador", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              operationId: last.operationId,
              amountIdr: last.amountIdr,
              bankLast4: last.bankLast4,
            }),
          }).catch(() => {});
        }
      } catch {}
    }
  }

  return (
    <div className="grid min-w-0 gap-6">
      <nav aria-label="Navigasi Brand Ambassador" className="flex flex-wrap items-center gap-2 border-b border-ux-border pb-3">
        <button
          type="button"
          onClick={() => { setUserSelectedView("recruitment"); setReview(false); }}
          className={cn(
            "rounded-control px-4 py-2 text-xs font-semibold transition-colors",
            currentView === "recruitment" && !review
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-secondary hover:bg-subtle hover:text-foreground",
          )}
        >
          Program & Link Afiliasi
        </button>
        <button
          type="button"
          onClick={() => { setUserSelectedView("ledger"); setReview(false); }}
          className={cn(
            "rounded-control px-4 py-2 text-xs font-semibold transition-colors",
            currentView === "ledger" && !review
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-secondary hover:bg-subtle hover:text-foreground",
          )}
        >
          Buku Kas & Riwayat Komisi
        </button>
        <button
          type="button"
          onClick={() => { setReview(true); }}
          className={cn(
            "rounded-control px-4 py-2 text-xs font-semibold transition-colors",
            review
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-secondary hover:bg-subtle hover:text-foreground",
          )}
        >
          Pencairan Komisi
        </button>
      </nav>

      {scenario === "hidden" ? (
        <p
          role="alert"
          className="rounded-card border border-border bg-surface p-6 text-sm text-secondary"
        >
          Brand Ambassador Hidden di luar sandbox. Entry point dibatasi; histori tidak dihapus.
        </p>
      ) : (
        <>
          {currentView === "recruitment" ? (
            <AmbassadorRecruitment state={state} context={context} />
          ) : (
            <AmbassadorLedger state={state} context={context} onWithdraw={() => setReview(true)} />
          )}
          {review && (
            <AmbassadorWithdrawal
              state={state}
              context={context}
              onResult={commit}
              onClose={() => setReview(false)}
            />
          )}
        </>
      )}
      {message && (
        <p role="status" className="text-sm text-secondary">
          {message}
        </p>
      )}
      <details className="rounded-control border border-border bg-surface p-4">
        <summary className="cursor-pointer text-xs font-semibold">
          Kondisi adapter sandbox · Brand Ambassador
        </summary>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="grid gap-2 text-xs">
            Skenario
            <select
              value={scenario}
              onChange={(e) => {
                setScenario(e.target.value);
                setMessage("");
              }}
              className="min-h-11 rounded-control border border-ux-border bg-surface px-3"
            >
              <option value="ready">Siap</option>
              <option value="offline">Offline</option>
              <option value="expired">Sesi berakhir</option>
              <option value="revoked">Izin dicabut</option>
              <option value="stale">Versi berubah</option>
              <option value="dispute">Sengketa aktif</option>
              <option value="hidden">Hidden di luar sandbox</option>
            </select>
          </label>
          <Button
            variant="secondary"
            onClick={() => {
              setScenario("ready");
              setMessage("Kondisi sandbox dipulihkan. Histori sesi tetap dipertahankan.");
            }}
          >
            Pulihkan kondisi sandbox
          </Button>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-secondary">
          Simulasi memori lokal. Tidak mengaktifkan referral, memanggil bank, atau menyimpan data
          lintas perangkat. Rilis #43 tetap Hidden.
        </p>
      </details>
    </div>
  );
}
