"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCommittedList } from "@/hooks/use-committed-list";
import type { PlanningItem, PlanningKind } from "../domain/planning-resource";
import { PlanningForm } from "./planning-form";
import { PlanningCalendar } from "./planning-calendar";
import { PlanningChecklist } from "./planning-checklist";
import { PlanningRundown } from "./planning-rundown";
import { PlanningCatering } from "./planning-catering";
import styles from "./planning.module.css";
const copy = {
  calendar: [
    "Kalender koordinasi",
    "Semua fitting, pertemuan vendor, dan tenggat dalam satu tempat.",
    "+ Jadwal baru",
  ],
  rundown: [
    "Rundown acara",
    "Jadwal yang jelas untuk keluarga, panitia, dan seluruh vendor.",
    "+ Kegiatan baru",
  ],
  emergency: [
    "Perlengkapan darurat Hari-H",
    "Siapkan dari sekarang, supaya hari bahagia terasa lebih tenang.",
    "+ Tambah barang",
  ],
  seserahan: [
    "Seserahan, satu per satu",
    "Beri makna pada setiap hantaran. Pantau barang dan pengeluarannya.",
    "+ Barang seserahan",
  ],
  catering: [
    "Hitung porsi, tanpa menebak",
    "Estimasi jumlah hadir dan bagikan porsi buffet serta gubukan dengan jelas.",
    "+ Menu katering",
  ],
};
import type { PlanningViewProps } from "../domain/planning-view";
export function PlanningEditor({
  kind,
  data,
  onSave,
}: {
  kind: PlanningKind;
  data: PlanningItem[];
  onSave: (items: PlanningItem[]) => Promise<boolean>;
}) {
  const [items, update] = useCommittedList(data, onSave);
  const [selected, setSelected] = useState<PlanningItem | null | undefined>(undefined);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function commit(next: PlanningItem[]) {
    if (pending) return false;
    setPending(true);
    try {
      const ok = await update(next);
      setError(
        ok
          ? ""
          : "Perubahan belum tersimpan. Periksa batas percobaan atau muat ulang data terbaru.",
      );
      return ok;
    } finally {
      setPending(false);
    }
  }
  const view: PlanningViewProps = {
    items,
    edit: setSelected,
    remove: (item) => {
      void commit(items.filter((i) => i.id !== item.id));
    },
    toggle: (item) => {
      void commit(
        items.map((i) =>
          i.id === item.id ? { ...i, completed: !("completed" in i && i.completed) } : i,
        ),
      );
    },
  };
  return (
    <section className={styles.container} aria-busy={pending}>
      <header className={styles.header}>
        <div>
          <h1>{copy[kind][0]}</h1>
          <p>{copy[kind][1]}</p>
        </div>
        <Button onClick={() => setSelected(null)}>{copy[kind][2]}</Button>
      </header>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      {pending && (
        <p role="status" className="text-xs text-secondary">
          Menyimpan perubahan…
        </p>
      )}
      {selected !== undefined && (
        <PlanningForm
          key={selected?.id ?? "new"}
          kind={kind}
          item={selected ?? undefined}
          cancel={() => setSelected(undefined)}
          save={async (next) => {
            if (
              selected &&
              JSON.stringify(items.find((i) => i.id === selected.id)) !== JSON.stringify(selected)
            ) {
              setError("Data berubah di tab lain. Buka ulang data terbaru sebelum mengedit.");
              return false;
            }
            const ok = await commit(
              selected ? items.map((i) => (i.id === next.id ? next : i)) : [...items, next],
            );
            if (ok) setSelected(undefined);
            return ok;
          }}
        />
      )}
      <fieldset disabled={pending} className="min-w-0 border-0 p-0">
        {kind === "calendar" ? (
          <PlanningCalendar {...view} />
        ) : kind === "rundown" ? (
          <PlanningRundown {...view} />
        ) : kind === "catering" ? (
          <PlanningCatering {...view} />
        ) : (
          <PlanningChecklist {...view} kind={kind} />
        )}
      </fieldset>
    </section>
  );
}
