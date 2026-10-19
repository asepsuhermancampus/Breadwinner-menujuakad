"use client";
import type { VendorContext } from "../types/vendor";
import { Button } from "@/components/ui/button";
export function VendorScenarios({
  context,
  onChange,
  onRefresh,
}: {
  context: VendorContext;
  onChange: (patch: Partial<VendorContext>) => void;
  onRefresh: () => void;
}) {
  return (
    <details className="rounded-control border border-ux-border bg-canvas p-3 text-xs text-secondary">
      <summary className="min-h-8 font-medium">
        Skenario pratinjau internal · data contoh, tanpa transaksi nyata
      </summary>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex min-h-11 items-center gap-3">
          <input
            type="checkbox"
            checked={context.online}
            onChange={(e) => onChange({ online: e.target.checked })}
          />
          Terhubung
        </label>
        <label className="flex min-h-11 items-center gap-3">
          <input
            type="checkbox"
            checked={context.sessionValid}
            onChange={(e) => onChange({ sessionValid: e.target.checked })}
          />
          Sesi dan izin aktif
        </label>
        <label className="flex min-h-11 items-center gap-3">
          <input
            type="checkbox"
            checked={context.slotAvailable}
            onChange={(e) => onChange({ slotAvailable: e.target.checked })}
          />
          Slot masih tersedia
        </label>
        <Button
          variant="secondary"
          size="small"
          onClick={() => onChange({ latestVersion: context.latestVersion + 1 })}
        >
          Simulasikan versi berubah
        </Button>
        <Button variant="secondary" size="small" onClick={onRefresh}>
          Muat versi, pertahankan draf
        </Button>
        <label className="grid gap-2">
          Scope akses
          <select
            className="min-h-11 rounded-control border border-ux-border px-3"
            value={context.role}
            onChange={(e) => onChange({ role: e.target.value as VendorContext["role"] })}
          >
            <option value="vendor">Pemilik vendor</option>
            <option value="support">Support terbatas</option>
            <option value="finance">Finance terbatas</option>
          </select>
        </label>
      </div>
      <p className="mt-3">
        Baseline rilis #43 tetap Hidden. Dokumen dan keputusan operasional hanya berada pada sesi
        simulasi ini; penyimpanan perangkat menyimpan katalog saja.
      </p>
    </details>
  );
}
