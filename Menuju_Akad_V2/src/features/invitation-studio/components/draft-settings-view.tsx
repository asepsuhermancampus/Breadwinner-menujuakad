"use client";

import { Button } from "@/components/ui/button";
import type { StudioSettings } from "../types/studio";

type Props = {
  settings: StudioSettings;
  onUpdateSetting: <K extends keyof StudioSettings>(key: K, val: StudioSettings[K]) => void;
  onOpenPublish: () => void;
};

export function DraftSettingsView({ settings, onUpdateSetting, onOpenPublish }: Props) {
  return (
    <div className="space-y-5">
      <div className="p-3 bg-warning-bg border border-warning/40 rounded-control flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs text-warning">
          <strong>
            Draf v{settings.draftVersion} tersimpan {settings.lastDraftSavedAt}
          </strong>{" "}
          · Perubahan belum tampil pada undangan aktif v{settings.publishedVersion}.
        </div>
        <Button variant="primary" size="small" onClick={onOpenPublish}>
          Publikasikan Draf v{settings.draftVersion} →
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-surface rounded-xl border border-border space-y-4">
          <h3 className="font-bold text-sm text-foreground">Pengaturan RSVP & Privasi</h3>

          <div>
            <label className="block text-xs font-semibold text-secondary mb-1">
              Batas Waktu Konfirmasi RSVP
            </label>
            <input
              type="text"
              value={settings.rsvpDeadline}
              onChange={(e) => onUpdateSetting("rsvpDeadline", e.target.value)}
              className="w-full text-xs font-mono rounded-control border border-border bg-canvas px-3 py-2"
            />
            <p className="text-[11px] text-secondary mt-1">
              Setelah batas waktu, formulir RSVP otomatis ditutup tanpa menyembunyikan tiket yang
              sudah didapat.
            </p>
          </div>

          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-foreground">Indeks Mesin Pencari</div>
                <div className="text-[11px] text-secondary">
                  Meta tag noindex pada perayap web (bukan pengaman akses privat)
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.searchEngineIndex}
                onChange={(e) => onUpdateSetting("searchEngineIndex", e.target.checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-foreground">Rekening Hadir & Amplop</div>
                <div className="text-[11px] text-secondary">
                  Baseline release #43: nonaktif dan disembunyikan
                </div>
              </div>
              <input
                type="checkbox"
                disabled
                checked={settings.giftAccountActive}
                className="opacity-50 cursor-not-allowed"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-foreground">
                  Musik Otomatis (Autoplay)
                </div>
                <div className="text-[11px] text-secondary">
                  Nonaktif · musik hanya berbunyi jika tamu sengaja menekan putar
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoplayMusic}
                onChange={(e) => onUpdateSetting("autoplayMusic", e.target.checked)}
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-surface rounded-xl border border-border flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
              Pratinjau Personal · Budi & Partner
            </div>
            <div className="p-4 bg-canvas rounded-lg border border-border text-center space-y-2">
              <div className="text-[10px] tracking-widest uppercase text-muted">The Wedding of</div>
              <div className="font-serif text-lg font-bold text-brand-secondary">Nama pasangan</div>
              <div className="text-xs font-semibold text-foreground">
                Minggu, 14 Februari 2027
                <br />
                Akad 08.00 · Resepsi 10.00 WIB
                <br />
                Bumi Samami, Bandung
              </div>
              <div className="pt-2 border-t border-border">
                <span className="text-xs font-bold text-foreground">Budi Santoso & Partner</span>
                <p className="text-[11px] text-secondary">
                  Undangan untuk maksimal 2 orang · Meja 04
                </p>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-secondary mt-3">
            Laman umum publik tidak memuat daftar tamu lain, nomor kontak, kuota pribadi, atau QR
            tiket masuk.
          </p>
        </div>
      </div>
    </div>
  );
}
