import { cn } from "@/lib/cn";

const badges = {
  pending: ["Menunggu", "bg-warning-bg text-warning"],
  eligible: ["Layak", "bg-success-bg text-success"],
  held: ["Ditahan", "bg-maintenance-bg text-maintenance"],
  failed: ["Gagal", "bg-danger-bg text-danger"],
  sent: ["Terkirim", "bg-success-bg text-success"],
  draft: ["Draf", "bg-subtle text-secondary"],
} as const;
export function OperationalBadge({
  status,
  label,
}: {
  status: keyof typeof badges;
  label?: string;
}) {
  const [title, colors] = badges[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-medium",
        colors,
      )}
    >
      {label ?? title}
    </span>
  );
}
const feedback = {
  otp: [
    "OTP salah atau kedaluwarsa",
    "Konfigurasi tetap v17. Pertahankan draf dan lakukan verifikasi ulang; tidak ada perubahan diterapkan.",
  ],
  unknown: [
    "Provider belum pasti",
    "Periksa transaksi yang sama. Jangan membuat charge, refund atau payout baru karena timeout.",
  ],
  stale: [
    "Versi berubah saat review",
    "Muat versi terbaru dan tinjau perubahan sebelum mengirim ulang. Draf Anda tetap tersedia.",
  ],
  consent: [
    "Izin WhatsApp dicabut",
    "Penerima dikeluarkan dari dispatch. Akses admin tidak menggantikan persetujuan penerima.",
  ],
  pwa: [
    "PWA tidak tersedia atau ditunda",
    "Gunakan browser untuk melanjutkan. Instalasi tidak memberikan izin notifikasi.",
  ],
  empty: ["Tidak ada antrean", "Tidak ada item yang perlu ditinjau pada filter ini."],
  loading: [
    "Memuat data",
    "Status terakhir tetap ditampilkan. Data yang belum dimuat bukan saldo nol.",
  ],
  accepted: [
    "Permohonan diterima, belum ditransfer",
    "Nominal ditahan satu kali. Selesai hanya setelah konfirmasi provider.",
  ],
  offline: [
    "Sinkronisasi gagal",
    "Draf tetap tersedia. Periksa koneksi dan sumber sebelum mengulang tindakan yang sama.",
  ],
  revoked: [
    "Izin atau sesi berakhir",
    "Pengiriman perubahan dihentikan. Masuk ulang atau minta akses; OTP tidak memberi izin baru.",
  ],
  draft: [
    "Perubahan tersimpan sebagai draf",
    "Tidak mengubah rekening aktif, fee, jadwal payout atau undangan aktif.",
  ],
} as const;
export function OperationalFeedback({ kind }: { kind: keyof typeof feedback }) {
  const [title, description] = feedback[kind];
  return (
    <div
      role={kind === "revoked" || kind === "stale" ? "alert" : "status"}
      className="grid gap-2 rounded-control border border-ux-border bg-canvas p-4 text-sm"
    >
      <p className="font-semibold">{title}</p>
      <p className="leading-relaxed text-secondary">{description}</p>
    </div>
  );
}
