"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { TableSeating } from "../types/guest";
import styles from "./guest-crm.module.css";

type Props = {
  initialTables?: TableSeating[];
};

export function GuestSeatingView({ initialTables }: Props) {
  const [tables, setTables] = useState<TableSeating[]>(
    initialTables || [
      {
        id: "t1",
        number: "01",
        name: "Meja 01",
        category: "Reguler",
        capacity: 10,
        assignedCount: 10,
        assignedGuests: [],
      },
      {
        id: "t2",
        number: "02",
        name: "Meja 02",
        category: "Reguler",
        capacity: 10,
        assignedCount: 7,
        assignedGuests: [],
      },
      {
        id: "t3",
        number: "03",
        name: "Meja 03",
        category: "Reguler",
        capacity: 10,
        assignedCount: 9,
        assignedGuests: [],
      },
      {
        id: "t4",
        number: "04",
        name: "Meja 04",
        category: "VIP",
        capacity: 10,
        assignedCount: 8,
        assignedGuests: [],
      },
      {
        id: "t5",
        number: "05",
        name: "Meja 05",
        category: "VIP",
        capacity: 10,
        assignedCount: 5,
        assignedGuests: [],
      },
      {
        id: "t6",
        number: "06",
        name: "Meja 06",
        category: "Reguler",
        capacity: 10,
        assignedCount: 6,
        assignedGuests: [],
      },
    ],
  );

  const [unplacedCount, setUnplacedCount] = useState(20);
  const [seatedCount, setSeatedCount] = useState(320);
  const [selectedUnplaced, setSelectedUnplaced] = useState<{ name: string; size: number } | null>({
    name: "Rafi & Keluarga",
    size: 3,
  });
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  function handleAssign(tableId: string) {
    if (!selectedUnplaced) return;
    const target = tables.find((t) => t.id === tableId);
    if (!target) return;

    const remaining = target.capacity - target.assignedCount;
    if (selectedUnplaced.size > remaining) {
      setWarningMessage(
        `Meja ${target.number} sisa ${remaining} kursi, tidak cukup untuk ${selectedUnplaced.name} (${selectedUnplaced.size} orang). Rombongan tidak boleh dipisah otomatis. Alternatif yang tersedia: Meja 05 (sisa 5 kursi).`,
      );
      return;
    }

    setWarningMessage(null);
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId ? { ...t, assignedCount: t.assignedCount + selectedUnplaced.size } : t,
      ),
    );
    setSeatedCount((prev) => prev + selectedUnplaced.size);
    setUnplacedCount((prev) => Math.max(0, prev - selectedUnplaced.size));
    setSelectedUnplaced(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-surface rounded-control border border-border">
        <div>
          <h3 className="font-bold text-foreground">Penempatan Meja & Kapasitas Kursi</h3>
          <p className="text-xs text-secondary mt-0.5">
            Total 340 RSVP hadir · {seatedCount} sudah duduk · {unplacedCount} belum ditempatkan
            (Kapasitas: 40 meja × 10 = 400 kursi)
          </p>
        </div>
        {selectedUnplaced && (
          <div className="flex items-center gap-2 bg-warning-bg px-3 py-1.5 rounded border border-warning/40 text-xs text-warning">
            <span>
              Rombongan siap ditempatkan:{" "}
              <strong>
                {selectedUnplaced.name} ({selectedUnplaced.size} orang)
              </strong>
            </span>
          </div>
        )}
      </div>

      {warningMessage && (
        <div className="p-3 bg-danger-bg text-danger border border-danger/40 rounded-control text-xs flex justify-between items-center">
          <span>{warningMessage}</span>
          <Button variant="ghost" size="small" onClick={() => setWarningMessage(null)}>
            Tutup
          </Button>
        </div>
      )}

      <div className={styles.seatingGrid}>
        {tables.map((table) => {
          const remaining = table.capacity - table.assignedCount;
          const isFull = remaining === 0;

          return (
            <div key={table.id} className={styles.tableCard}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold text-foreground">{table.name}</div>
                  <span className="text-xs px-2 py-0.5 rounded bg-subtle text-secondary">
                    {table.category}
                  </span>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    isFull ? "bg-danger-bg text-danger" : "bg-success-bg text-success"
                  }`}
                >
                  {isFull ? "Kapasitas penuh" : `${remaining} kursi tersedia`}
                </span>
              </div>

              <div className="my-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-secondary">Terisi</span>
                  <span className="font-mono font-bold">
                    {table.assignedCount} / {table.capacity} orang
                  </span>
                </div>
                <div className="h-2 w-full bg-subtle rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(table.assignedCount / table.capacity) * 100}%` }}
                  />
                </div>
              </div>

              {selectedUnplaced && (
                <Button
                  variant={remaining >= selectedUnplaced.size ? "primary" : "secondary"}
                  size="small"
                  className="w-full text-xs"
                  onClick={() => handleAssign(table.id)}
                >
                  {remaining >= selectedUnplaced.size
                    ? `Tempatkan di Meja ${table.number}`
                    : `Pilih Meja ${table.number} (Periksa Kapasitas)`}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
