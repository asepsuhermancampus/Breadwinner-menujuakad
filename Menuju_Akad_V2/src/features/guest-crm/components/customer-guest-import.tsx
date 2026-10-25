"use client";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { GuestInvitation } from "../types/guest";
import { parseGuestCsv } from "../utils/customer-import";
export function CustomerGuestImport({
  open,
  close,
  save,
}: {
  open: boolean;
  close: () => void;
  save: (guests: GuestInvitation[]) => Promise<boolean>;
}) {
  const [csv, setCsv] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <Dialog open={open} onClose={close} title="Impor CSV">
      <form
        className="grid gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (busy) return;
          setBusy(true);
          try {
            const guests = parseGuestCsv(csv);
            if (await save(guests)) {
              setCsv("");
              setError("");
              close();
            } else setError("Data belum tersimpan. Periksa batas paket atau percobaan.");
          } catch (e) {
            setError(e instanceof Error ? e.message : "CSV tidak dapat dibaca.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <p className="text-sm">
          Gunakan kolom nama, telepon, kuota, grup. Kolom nama wajib. Persetujuan WhatsApp tidak
          diaktifkan otomatis lewat impor.
        </p>
        <label className="grid gap-1 text-sm">
          Berkas CSV
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 1e6) {
                setError("CSV maksimal 1 MB.");
                return;
              }
              try {
                setCsv(await file.text());
                setError("");
              } catch {
                setError("Berkas tidak dapat dibaca.");
              }
            }}
          />
        </label>
        <label className="grid gap-1 text-sm">
          Isi CSV
          <textarea
            className="min-h-40 rounded-control border border-ux-border bg-canvas p-3"
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            placeholder="nama,telepon,kuota,grup"
          />
        </label>
        {error && <p role="alert">{error}</p>}
        <Button type="submit" disabled={busy}>
          Impor tamu
        </Button>
      </form>
    </Dialog>
  );
}
