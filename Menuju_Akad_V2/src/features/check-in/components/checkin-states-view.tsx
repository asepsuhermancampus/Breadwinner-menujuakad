"use client";

import { useState } from "react";

export function CheckinStatesView() {
  const [selectedCase, setSelectedCase] = useState<"offline" | "duplicate" | "overquota">(
    "offline",
  );

  return (
    <div className="space-y-4">
      <div className="p-3 bg-subtle border border-border rounded-control">
        <h3 className="font-bold text-foreground text-sm">
          Penanganan Kasus Pengecualian Check-in (Edge States)
        </h3>
        <p className="text-xs text-secondary mt-0.5">
          Tiga state terpisah. Tidak ada penambahan kehadiran sebelum validasi daring dan konfirmasi
          atomik yang sah.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setSelectedCase("offline")}
          className={`px-3 py-1.5 text-xs font-semibold rounded ${
            selectedCase === "offline" ? "bg-primary text-white" : "bg-subtle text-secondary"
          }`}
        >
          1. Kasus Offline
        </button>
        <button
          type="button"
          onClick={() => setSelectedCase("duplicate")}
          className={`px-3 py-1.5 text-xs font-semibold rounded ${
            selectedCase === "duplicate" ? "bg-primary text-white" : "bg-subtle text-secondary"
          }`}
        >
          2. Tiket Sudah Dipakai (Duplikat)
        </button>
        <button
          type="button"
          onClick={() => setSelectedCase("overquota")}
          className={`px-3 py-1.5 text-xs font-semibold rounded ${
            selectedCase === "overquota" ? "bg-primary text-white" : "bg-subtle text-secondary"
          }`}
        >
          3. Melebihi Sisa Kuota
        </button>
      </div>

      {selectedCase === "offline" && (
        <div className="p-4 bg-warning-bg/40 border border-warning rounded-xl space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-warning font-bold">10:21 WIB · OFFLINE</span>
            <span className="bg-warning text-white px-2 py-0.5 rounded text-[10px] font-bold">
              KONEKSI TERPUTUS
            </span>
          </div>
          <h4 className="font-bold text-foreground">QR Terbaca ≠ Tiket Sah / Boleh Masuk</h4>
          <p className="text-xs text-secondary leading-relaxed">
            QR code yang berhasil dipindai saat offline hanya membaca cache identitas. Validasi
            tiket belum tersedia karena status pembatalan, pencabutan, atau kedatangan di gerbang
            lain tidak dapat diverifikasi tanpa koneksi.
          </p>
          <div className="p-3 bg-surface rounded-lg border border-border text-xs space-y-1">
            <div className="font-semibold text-foreground">3 Pindaian Menunggu Validasi Daring</div>
            <div className="text-secondary text-[11px]">
              Budi Santoso & Partner · Kecocokan cache lokal · Belum dihitung sebagai check-in resmi
            </div>
          </div>
          <div className="text-[11px] text-muted italic">
            Setelah perangkat terhubung kembali, sistem memeriksa ulang kuota dan duplikat secara
            daring. Konflik tidak disetujui otomatis.
          </div>
        </div>
      )}

      {selectedCase === "duplicate" && (
        <div className="p-4 bg-danger-bg/40 border border-danger rounded-xl space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-danger font-bold">10:21 WIB · DARING</span>
            <span className="bg-danger text-white px-2 py-0.5 rounded text-[10px] font-bold">
              DUPLIKAT DITOLAK
            </span>
          </div>
          <h4 className="font-bold text-danger">Tiket Sudah Digunakan Penuh</h4>
          <p className="text-xs text-secondary leading-relaxed">
            Tidak ada sisa kuota untuk undangan ini. Jangan catat kedatangan lagi untuk menghindari
            lonjakan kapasitas ruangan.
          </p>
          <div className="p-3 bg-surface rounded-lg border border-border text-xs space-y-1">
            <div className="font-bold text-foreground">Budi Santoso & Partner</div>
            <div className="text-danger font-semibold">2 / 2 orang sudah masuk</div>
            <div className="text-secondary text-[11px]">
              Tercatat pada 10.18 WIB oleh <strong>Raka / Gerbang B</strong>
            </div>
          </div>
          <p className="text-[11px] text-secondary">
            Koreksi atau pembatalan catatan kedatangan hanya dapat dilakukan oleh Koordinator Acara
            dengan alasan tertulis dan jejak audit yang tidak dapat dihapus.
          </p>
        </div>
      )}

      {selectedCase === "overquota" && (
        <div className="p-4 bg-surface border border-warning rounded-xl space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-secondary font-bold">10:21 WIB · DARING</span>
            <span className="bg-warning text-white px-2 py-0.5 rounded text-[10px] font-bold">
              KUOTA TERBATAS
            </span>
          </div>
          <h4 className="font-bold text-foreground">Jumlah Input Melebihi Sisa Kuota</h4>
          <p className="text-xs text-secondary leading-relaxed">
            Tamu datang bersama 2 orang, namun sisa kuota yang terdaftar pada sistem hanya 1 orang.
          </p>
          <div className="p-3 bg-canvas rounded-lg border border-border text-xs space-y-1">
            <div className="font-bold text-foreground">Budi Santoso & Partner</div>
            <div className="text-secondary">
              Kuota total 2 orang · 1 orang sudah masuk sebelumnya ·{" "}
              <strong className="text-foreground">Sisa kuota: 1 orang</strong>
            </div>
          </div>
          <p className="text-[11px] text-secondary">
            Sistem menolak input kedatangan 2 orang. Sesuaikan input kedatangan menjadi maksimal 1
            orang atau arahkan tamu ke meja helpdesk koordinator.
          </p>
        </div>
      )}
    </div>
  );
}
