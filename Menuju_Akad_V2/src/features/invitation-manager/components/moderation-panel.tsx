"use client";

import { useState } from "react";
import { moderationItems, moderationSummary } from "../content/moderation-content";
import { decideModeration } from "../domain/moderation";
import { ModerationDialog } from "./moderation-dialog";
import type { ModerationItem } from "../types/manager";

export function ModerationPanel() {
  const [items, setItems] = useState<ModerationItem[]>(moderationItems);
  const [active, setActive] = useState<ModerationItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const reviewed = items.filter((item) => item.status !== "Menunggu");
  const pending = items.filter((item) => item.status === "Menunggu");
  const pendingWishes =
    moderationSummary.pendingWishes - reviewed.filter((item) => item.kind === "Ucapan").length;
  const pendingPhotos =
    moderationSummary.pendingPhotos - reviewed.filter((item) => item.kind === "Foto").length;

  function decide(status: "Ditampilkan" | "Disembunyikan", reason: string) {
    const current = items.find((item) => item.id === active?.id);
    if (!current || !active) return;
    const result = decideModeration(current, active.version, status, reason);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setItems((previous) => previous.map((item) => (item.id === current.id ? result.item : item)));
    setNotice(
      `${current.publicName}: ${status.toLowerCase()} (simulasi). Alasan dan versi ${result.item.version} dicatat.`,
    );
    setActive(null);
  }

  return (
    <section className="grid gap-4" aria-label="Moderasi ucapan dan foto">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Menunggu",
            value: String(pendingWishes + pendingPhotos),
            note: `${pendingWishes} ucapan · ${pendingPhotos} foto`,
          },
          {
            label: "Ditampilkan",
            value: String(
              moderationSummary.shown +
                reviewed.filter((item) => item.status === "Ditampilkan").length,
            ),
            note: "Disetujui oleh pasangan",
          },
          {
            label: "Disembunyikan",
            value: String(
              moderationSummary.hidden +
                reviewed.filter((item) => item.status === "Disembunyikan").length,
            ),
            note: "Tidak terlihat publik",
          },
          {
            label: "Mode moderasi",
            value: moderationSummary.mode,
            note: "Tidak otomatis menerbitkan unggahan",
          },
        ].map((metric) => (
          <div key={metric.label} className="rounded-card border border-border bg-surface p-4">
            <p className="text-[10px] font-bold tracking-widest text-secondary">{metric.label}</p>
            <p className="mt-1 text-xl font-bold">{metric.value}</p>
            <p className="mt-0.5 text-xs text-secondary">{metric.note}</p>
          </div>
        ))}
      </div>
      {notice && (
        <p role="status" className="text-xs text-success">
          {notice}
        </p>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="min-w-0 rounded-card border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-canvas text-secondary">
                  {["Tamu", "Jenis", "Status", "Waktu"].map((label) => (
                    <th key={label} scope="col" className="p-3 font-semibold">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-border">
                    <th scope="row" className="p-3 font-semibold">
                      {item.guest}
                    </th>
                    <td className="p-3">{item.kind}</td>
                    <td className="p-3">{item.status}</td>
                    <td className="p-3 font-mono">{item.submittedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-border p-3 text-xs text-secondary">
            {pending.length} dari {pendingWishes + pendingPhotos} kiriman menunggu ditampilkan
          </p>
          <p className="border-t border-border p-3 text-xs text-secondary">
            Empat baris adalah sampel. Persetujuan dapat ditarik; keputusan memiliki alasan, versi,
            dan jejak audit lokal.
          </p>
        </div>
        <div className="grid content-start gap-3 rounded-card border border-border bg-surface p-5">
          <h3 className="text-sm font-bold">Tinjau kiriman</h3>
          {pending.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActive(item);
                setError(null);
              }}
              className="flex min-h-11 items-center justify-between gap-3 rounded-control border border-border bg-canvas p-3 text-left hover:bg-subtle"
            >
              <span>
                <span className="block text-xs font-semibold">{item.guest}</span>
                <span className="text-xs text-secondary">
                  {item.kind} · {item.submittedAt}
                </span>
              </span>
              <span className="text-xs font-bold text-brand-secondary">Tinjau →</span>
            </button>
          ))}
          {pending.length === 0 && (
            <p className="text-xs text-secondary">
              Seluruh sampel sudah ditinjau. Delapan kiriman lainnya belum dimuat dalam simulasi
              ini.
            </p>
          )}
        </div>
      </div>
      {reviewed.length > 0 && (
        <details className="rounded-card border border-border bg-surface p-4">
          <summary className="min-h-11 cursor-pointer text-xs font-semibold">
            Jejak keputusan lokal
          </summary>
          <ul className="grid gap-2 text-xs">
            {reviewed.flatMap((item) =>
              item.audit.map((entry) => (
                <li key={`${item.id}-${entry.version}`}>
                  {item.publicName} · {entry.status} · v{entry.version} · {entry.reason} ·{" "}
                  {entry.actor}
                </li>
              )),
            )}
          </ul>
        </details>
      )}
      {active && (
        <ModerationDialog
          key={active.id}
          item={active}
          error={error}
          onClose={() => setActive(null)}
          onDecide={decide}
        />
      )}
    </section>
  );
}
