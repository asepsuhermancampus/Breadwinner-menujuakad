"use client";

import { analyticsFixture } from "@/features/invitation-manager/content/manager-content";

export function AnalyticsPanel() {
  const a = analyticsFixture;
  const maxSessions = Math.max(...a.daily.map((d) => d.sessions));
  const { onlineAttend, onlineDecline, manualAttend, manualDecline, crmAttend, crmDecline } =
    a.reconciliation;
  return (
    <section className="grid gap-4" aria-label="Analitik undangan">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Pengunjung unik",
            value: String(a.uniqueVisitors),
            note: "Termasuk laman umum",
          },
          {
            label: "Sesi kunjungan",
            value: String(a.sessions),
            note: "Bisa lebih dari sekali per orang",
          },
          {
            label: "Tautan personal dibuka",
            value: `${a.personalOpens} undangan`,
            note: `Dari 350 undangan Pernikahan`,
          },
          {
            label: "RSVP daring",
            value: `${a.onlineAnswers} · ${a.onlineConversion}%`,
            note: `${a.onlineAnswers} dari ${a.personalOpens} tautan personal`,
          },
        ].map((m) => (
          <div key={m.label} className="rounded-card border border-border bg-surface p-4">
            <p className="text-[10px] font-bold tracking-widest text-secondary">{m.label}</p>
            <p className="mt-1 font-mono text-xl font-bold text-foreground">{m.value}</p>
            <p className="mt-0.5 text-[11px] text-muted">{m.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="rounded-card border border-border bg-surface p-5 lg:col-span-3">
          <h3 className="text-sm font-bold text-foreground">Sesi kunjungan per hari</h3>
          <div
            className="mt-4 flex h-40 items-end gap-3"
            role="img"
            aria-label={`Sesi per hari, total ${a.sessions}`}
          >
            {a.daily.map((d) => (
              <div key={d.label} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <span className="font-mono text-[10px] font-bold text-foreground">
                  {d.sessions}
                </span>
                <div
                  className="w-full rounded-t-control bg-primary"
                  style={{ height: `${Math.round((d.sessions / maxSessions) * 110)}px` }}
                />
                <span className="text-[10px] text-secondary">{d.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs">
            {a.devices.map((d) => (
              <div key={d.label}>
                <span className="text-secondary">{d.label}</span>
                <span className="float-right font-mono font-semibold text-foreground">
                  {d.sessions} sesi
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface p-5 lg:col-span-2">
          <h3 className="font-serif text-2xl leading-tight text-foreground">
            Dari tautan
            <br />
            ke konfirmasi.
          </h3>
          <div className="mt-4 grid gap-2">
            {a.funnel.map((f, i) => (
              <div key={f.label} className="rounded-control border border-border bg-canvas p-3">
                <p className="font-mono text-lg font-bold text-foreground">{f.value}</p>
                <p className="text-[11px] text-secondary">{f.label}</p>
                {i === a.funnel.length - 1 && (
                  <div className="mt-1 h-1 rounded-full bg-ux-dock">
                    <div className="h-1 rounded-full bg-primary" style={{ width: "80%" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-card border border-border bg-surface p-5">
        <p className="text-xs font-bold text-foreground">Rekonsiliasi dengan CRM</p>
        <p className="mt-1 text-xs text-secondary">
          Daring: {onlineAttend} hadir + {onlineDecline} berhalangan ={" "}
          {onlineAttend + onlineDecline}. Manual: {manualAttend} hadir + {manualDecline} berhalangan
          = {manualAttend + manualDecline}. Total CRM: {crmAttend} hadir + {crmDecline} berhalangan
          = {crmAttend + crmDecline} jawaban. Sesi kunjungan bukan jumlah tamu hadir.
        </p>
      </div>
    </section>
  );
}
