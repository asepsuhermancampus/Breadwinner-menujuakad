"use client";
import { useUrlTab } from "@/hooks/use-url-tab";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Status } from "@/components/ui/status";
import type { CheckinLog } from "../types/checkin";
import { TicketScannerDialog } from "./ticket-scanner-dialog";
import { CheckinStatesView } from "./checkin-states-view";
import { StaffAccessView } from "./staff-access-view";

type Props = {
  initialTotalRsvp?: number;
  initialValidated?: number;
  initialRemaining?: number;
};

export function CheckinConsoleScreen({
  initialTotalRsvp = 340,
  initialValidated = 214,
  initialRemaining = 126,
}: Props) {
  const [tab, setTab] = useUrlTab("tab", ["console", "states", "staff"], "console");
  const [validatedCount, setValidatedCount] = useState(initialValidated);
  const [remainingCount, setRemainingCount] = useState(initialRemaining);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [logs, setLogs] = useState<CheckinLog[]>([
    {
      id: "l-1",
      time: "10.18 WIB",
      guestName: "Keluarga Arif",
      arrivedPax: 4,
      tableNumber: "08",
      status: "Tervalidasi",
      gate: "Gerbang A",
      staffName: "Dina",
    },
    {
      id: "l-2",
      time: "10.16 WIB",
      guestName: "Dewi Anggraini",
      arrivedPax: 1,
      tableNumber: "07",
      status: "Tervalidasi",
      gate: "Gerbang A",
      staffName: "Dina",
    },
  ]);

  function handleConfirmArrival(guestName: string, pax: number, tableNumber: string) {
    setValidatedCount((prev) => prev + pax);
    setRemainingCount((prev) => Math.max(0, prev - pax));
    const newLog: CheckinLog = {
      id: `l-${Date.now()}`,
      time: "10.20 WIB",
      guestName,
      arrivedPax: pax,
      tableNumber,
      status: "Tervalidasi",
      gate: "Gerbang A",
      staffName: "Dina",
    };
    setLogs((prev) => [newLog, ...prev]);
  }

  const filteredLogs = logs.filter(
    (l) =>
      !searchQuery ||
      l.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.tableNumber.includes(searchQuery),
  );

  return (
    <div className="min-h-screen bg-canvas text-foreground p-6 max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 p-4 bg-surface rounded-xl border border-border">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-muted">
            Konsol Operasional Check-in
          </div>
          <h1 className="text-xl font-bold text-foreground">Pernikahan Andi & Risa</h1>
          <p className="text-xs text-secondary mt-0.5">
            14 Februari 2027 · Bumi Samami, Bandung · Petugas: <strong>Dina (Gerbang A)</strong>
          </p>
        </div>
        <Button variant="primary" onClick={() => setScannerOpen(true)}>
          📷 Pindai Tiket Personal
        </Button>
      </div>

      <div className="p-3 bg-subtle border border-border rounded-control text-xs text-secondary">
        <strong>SIMULASI HARI H · 14 Februari 2027:</strong> Konsol ini beroperasi pada data
        operasional hari-H, bukan data perencanaan snapshot CRM 25 Oktober 2026.
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-surface border border-border rounded-xl">
          <div className="text-2xl font-bold font-mono text-foreground">{initialTotalRsvp}</div>
          <div className="text-xs text-secondary mt-1">Total RSVP Hadir</div>
        </div>
        <div className="p-4 bg-surface border border-border rounded-xl">
          <div className="text-2xl font-bold font-mono text-success">{validatedCount}</div>
          <div className="text-xs text-secondary mt-1">Tamu Tervalidasi Masuk</div>
        </div>
        <div className="p-4 bg-surface border border-border rounded-xl">
          <div className="text-2xl font-bold font-mono text-warning">{remainingCount}</div>
          <div className="text-xs text-secondary mt-1">Sisa Tamu Ditunggu</div>
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        <button
          type="button"
          onClick={() => setTab("console")}
          className={`text-xs font-semibold px-3 py-1.5 rounded ${
            tab === "console" ? "bg-primary text-on-primary" : "bg-subtle text-secondary"
          }`}
        >
          Riwayat Kedatangan
        </button>
        <button
          type="button"
          onClick={() => setTab("states")}
          className={`text-xs font-semibold px-3 py-1.5 rounded ${
            tab === "states" ? "bg-primary text-on-primary" : "bg-subtle text-secondary"
          }`}
        >
          Simulasi Kasus Edge (Offline / Duplikat)
        </button>
        <button
          type="button"
          onClick={() => setTab("staff")}
          className={`text-xs font-semibold px-3 py-1.5 rounded ${
            tab === "staff" ? "bg-primary text-on-primary" : "bg-subtle text-secondary"
          }`}
        >
          Kelola Tim Gerbang
        </button>
      </div>

      {tab === "console" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="search"
              placeholder="Cari nama tamu atau ID tiket…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-xs rounded-control border border-border bg-surface px-3 py-2"
            />
          </div>

          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-subtle text-secondary font-semibold border-b border-border">
                <tr>
                  <th className="p-3">Waktu</th>
                  <th className="p-3">Nama Tamu</th>
                  <th className="p-3">Jumlah Hadir</th>
                  <th className="p-3">Meja</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Gerbang</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border last:border-0">
                    <td className="p-3 font-mono text-secondary">{log.time}</td>
                    <td className="p-3 font-semibold text-foreground">{log.guestName}</td>
                    <td className="p-3 font-mono">{log.arrivedPax} orang</td>
                    <td className="p-3">Meja {log.tableNumber}</td>
                    <td className="p-3">
                      <Status tone="success">{log.status}</Status>
                    </td>
                    <td className="p-3 text-secondary">{log.gate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "states" && <CheckinStatesView />}

      {tab === "staff" && <StaffAccessView />}

      <TicketScannerDialog
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        currentValidated={validatedCount}
        onConfirmArrival={handleConfirmArrival}
      />
    </div>
  );
}
