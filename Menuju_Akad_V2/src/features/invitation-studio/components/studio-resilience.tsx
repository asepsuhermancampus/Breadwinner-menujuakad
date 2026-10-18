"use client";

import { Button } from "@/components/ui/button";
import type { StudioEditor } from "../hooks/use-studio-editor";

export function StudioResilience({ editor }: { editor: StudioEditor }) {
  const { state, dispatch, exportDraft } = editor;
  const env = state.environment;
  const conflict = env.serverVersion !== state.document.expectedVersion;
  return (
    <div className="grid gap-4">
      <h2 className="text-sm font-semibold">Ketahanan draf lokal</h2>
      <p className="text-xs leading-relaxed text-secondary">
        Skenario adapter contoh. Tidak mengubah izin, koneksi, atau publikasi produksi.
      </p>
      {(
        [
          ["online", "Terhubung"],
          ["canEdit", "Izin mengedit"],
          ["entitled", "Premium aktif"],
          ["available", "Studio tersedia"],
          ["saveFailure", "Simulasikan gagal simpan"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="flex min-h-11 items-center gap-3 text-xs">
          <input
            type="checkbox"
            checked={env[key]}
            onChange={(event) =>
              dispatch({ type: "environment", patch: { [key]: event.target.checked } })
            }
          />
          {label}
        </label>
      ))}
      <Button
        variant="secondary"
        size="small"
        onClick={() =>
          dispatch({ type: "environment", patch: { serverVersion: env.serverVersion + 1 } })
        }
      >
        Simulasikan konflik versi
      </Button>
      {conflict && (
        <div
          role="alert"
          className="grid gap-3 rounded-control bg-warning-bg p-3 text-xs text-warning"
        >
          <strong>Konflik lokasi</strong>
          <p>
            Awal: Bumi Samami · server: Garden · lokal: {state.document.content.venue}. Pilih versi
            untuk draf; simpan kembali setelah meninjau.
          </p>
          <Button
            size="small"
            variant="secondary"
            onClick={() => dispatch({ type: "resolve", source: "local" })}
          >
            Terapkan draf lokal
          </Button>
          <Button
            size="small"
            variant="secondary"
            onClick={() => dispatch({ type: "resolve", source: "server" })}
          >
            Gunakan nilai server
          </Button>
        </div>
      )}
      <Button size="small" variant="secondary" onClick={() => dispatch({ type: "save" })}>
        Coba simpan draf
      </Button>
      <Button size="small" variant="secondary" onClick={exportDraft}>
        Ekspor salinan draf
      </Button>
      <p className="text-xs text-secondary">
        Offline, konflik, atau akses berubah menahan publikasi. Draf tidak ditimpa atau dihapus.
      </p>
    </div>
  );
}
