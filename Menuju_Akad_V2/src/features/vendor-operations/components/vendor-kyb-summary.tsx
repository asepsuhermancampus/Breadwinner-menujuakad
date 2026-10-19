import { Icon } from "@/components/ui/icon";
import type { VendorWorkspace } from "../types/vendor";

export function VendorKybNotice({ pending }: { pending: boolean }) {
  return (
    <div
      className={`flex gap-3 rounded-control border p-4 ${pending ? "border-border bg-subtle" : "border-warning/30 bg-warning/5"}`}
    >
      <Icon name={pending ? "clock" : "alert-circle"} className="shrink-0 text-warning" />
      <div>
        <h2 className="text-sm font-semibold">
          {pending ? "Revisi rekening menunggu peninjauan" : "Bukti rekening terpotong"}
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-secondary">
          {pending
            ? "Pengajuan simulasi lokal tersimpan. Rekening lama tetap aktif sampai peninjauan selesai; perubahan ini belum dikirim ke layanan verifikasi."
            : "Admin belum dapat membaca nama pemilik rekening. Unggah ulang bukti utuh, tanpa potongan, agar nama dan nomor rekening terlihat jelas."}
        </p>
      </div>
    </div>
  );
}
export function VendorKybSummary({ state }: { state: VendorWorkspace }) {
  const { kyb, catalog } = state;
  const documents = [
    ["Legalitas usaha", "Dokumen usaha tervalidasi", true],
    ["Identitas pemilik", "KTP •••• 3290 · tervalidasi", true],
    [
      "Rekening usulan",
      `${kyb.proposedBank.bankName} ••${kyb.proposedBank.last4} · ${kyb.status === "pending" ? "dalam peninjauan" : "perlu revisi"}`,
      false,
    ],
    ["Lokasi usaha", `${catalog.profile.city} · terkonfirmasi`, true],
  ] as const;
  return (
    <aside className="rounded-card bg-ux-dock p-6">
      <div className="flex items-center gap-2">
        <Icon name="lock" />
        <h2 className="font-semibold">Berkas privat</h2>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-secondary">
        Hanya pemilik usaha dan peninjau berwenang yang dapat memeriksa berkas verifikasi.
      </p>
      <ul className="mt-6 grid gap-5">
        {documents.map(([title, detail, done]) => (
          <li key={title} className="flex gap-3">
            <Icon
              name={done ? "check-circle" : "clock"}
              className={done ? "text-success" : "text-warning"}
            />
            <div>
              <p className="text-sm font-medium">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-secondary">{detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
export function VendorKybActiveBank({ state }: { state: VendorWorkspace }) {
  return (
    <footer className="border-t border-border py-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <Icon name="shield" size={16} />
        Rekening aktif tidak berubah
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-secondary">
        {state.kyb.verifiedBank.bankName} ••{state.kyb.verifiedBank.last4} tetap aktif. Rekening{" "}
        {state.kyb.proposedBank.bankName} belum memenuhi syarat pencairan sebelum diverifikasi.
      </p>
    </footer>
  );
}
