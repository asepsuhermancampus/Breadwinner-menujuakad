import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { OperationDialog as Dialog } from "./operation-panel";
import { Status } from "@/components/ui/status";
import { services } from "../content/health";
import { prepareMaintenance } from "../domain/maintenance";
import { hasPermission } from "../domain/guards";
import type { Feedback } from "../types/operations";
import type { PanelProps } from "../types/panel";
import { Badge, CheckLine, Inspector, OperationHeading, OperationNote } from "./operation-ui";
export function HealthPanel({ context, role }: PanelProps) {
  const [reason, setReason] = useState("Perbaikan antrean notifikasi");
  const [eta, setEta] = useState("2026-10-25T15:00");
  const [enabled, setEnabled] = useState(false);
  const [review, setReview] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  function prepare() {
    const result = prepareMaintenance(reason, `${eta}:00+07:00`, context("maintenance.draft", 43));
    setFeedback(result);
    if (result.ok) setReview(true);
  }
  return (
    <>
      <OperationHeading
        title="Layanan terpantau, perubahan terkendali."
        description="Monitor sandbox · status contoh 25 Okt 10.50 WIB · tidak ada perubahan server dijalankan."
        action={
          <Button variant="secondary" onClick={() => setReview(true)}>
            Buka Feature Studio
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Layanan normal", "4 / 5", "Antrean notifikasi terdegradasi"],
          ["Backlog notifikasi", "5 pesan", "Usia tertua contoh: 4 menit"],
          ["Backup terakhir", "02.00 WIB", "Checksum lolos, bukan jaminan restore"],
        ].map(([label, value, note]) => (
          <section key={label} className="rounded-card border border-ux-border p-5">
            <h2 className="text-xs text-secondary">{label}</h2>
            <p className="mt-3 font-mono text-2xl font-semibold">{value}</p>
            <p className="mt-2 text-xs text-secondary">{note}</p>
          </section>
        ))}
      </div>
      {feedback && <Status tone={feedback.ok ? "success" : "danger"}>{feedback.message}</Status>}
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <div className="grid min-w-0 content-start gap-5">
          <div className="overflow-x-auto rounded-card border border-ux-border">
            <table className="w-full text-left text-xs">
              <caption className="sr-only">Kesehatan lima layanan sandbox</caption>
              <thead className="bg-ux-dock text-secondary">
                <tr>
                  {["Layanan", "Status", "Catatan"].map((title) => (
                    <th key={title} scope="col" className="p-4 font-medium">
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {services.map(([name, status, note]) => (
                  <tr key={name} className="border-t border-ux-border">
                    <th className="p-4 font-medium" scope="row">
                      {name}
                    </th>
                    <td className="p-4">
                      <Badge danger={status !== "Normal"}>{status}</Badge>
                    </td>
                    <td className="p-4 text-secondary">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <OperationNote title="Backup dan pemulihan diuji terpisah">
            Latihan restore terakhir: 20 Okt di sandbox (fixture). Monitor ini tidak menjalankan
            restore, menghapus antrean, atau mengirim ulang transaksi. Checksum bukan bukti restore.
          </OperationNote>
        </div>
        <Inspector
          title="Draf maintenance"
          description="Belum diterapkan ke role atau layanan apa pun."
        >
          <Field label="Scope usulan" value="Vendor · sandbox Preset 3" readOnly />
          <Field
            label="Alasan"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
          <Field
            label="Estimasi selesai · WIB"
            type="datetime-local"
            value={eta}
            onChange={(event) => setEta(event.target.value)}
          />
          <CheckLine checked={enabled} onChange={setEnabled}>
            Siapkan mode maintenance sebagai draf
          </CheckLine>
          <Button
            disabled={!enabled || !hasPermission(role, "maintenance.draft")}
            onClick={prepare}
          >
            Review dampak di Feature Studio
          </Button>
          {!hasPermission(role, "maintenance.draft") && (
            <p className="text-xs text-secondary">Scope Keuangan hanya membaca monitor layanan.</p>
          )}
          <p className="text-xs leading-relaxed text-secondary">
            Alur dampak → alasan → OTP → konfirmasi di Feature Studio. Draf tidak mengubah rilis #43
            atau transaksi berjalan.
          </p>
        </Inspector>
      </div>
      <Dialog open={review} onClose={() => setReview(false)} title="Feature Studio · review dampak">
        <div className="grid gap-4">
          <p className="text-sm">
            Scope: Vendor · sandbox Preset 3. Alasan: {reason}. ETA: {eta.replace("T", " ")} WIB.
          </p>
          <Status tone="warning">
            Draf belum diterapkan. Vendor/BA tetap Hidden pada rilis #43. Perubahan availability
            memerlukan review dampak, izin khusus, versi, OTP dan konfirmasi melalui alur rilis
            terpisah.
          </Status>
          <p className="text-sm text-secondary">
            Review lokal ini mempertahankan data historis dan transaksi berjalan. Backend Feature
            Studio belum terhubung.
          </p>
          <Button variant="secondary" onClick={() => setReview(false)}>
            Kembali ke draf maintenance
          </Button>
        </div>
      </Dialog>
    </>
  );
}
