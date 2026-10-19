"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { historicalFinanceAudit } from "../content/finance-content";
import { appendFinanceCorrection, exportFinanceAudit } from "../domain/finance-audit";
import type { FinanceAudit, FinanceScreenProps } from "../types/admin-finance";
import { FinanceCard, FinanceHeader, FinanceNote, FinanceTable } from "./finance-parts";
import styles from "./finance.module.css";

export function FinanceAuditView({
  state,
  context,
  onResult,
  compact = false,
}: FinanceScreenProps & { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<FinanceAudit | null>(null);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState(false);
  const rows = [...state.audit]
    .reverse()
    .filter((entry) =>
      `${entry.actor} ${entry.objectId} ${entry.action}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  function download() {
    const result = exportFinanceAudit(state, context);
    setMessage(result.message);
    if (!result.ok) return;
    const url = URL.createObjectURL(new Blob([result.csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "audit-keuangan-mock.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      {!compact && (
        <FinanceHeader
          title="Jejak yang tetap bisa diperiksa."
          detail="Event lokal setelah konfirmasi eksplisit · histori tidak dapat ditimpa atau dihapus."
          action={
            <Button onClick={download} disabled={!context.permissions.export}>
              Ekspor audit terbatas
            </Button>
          }
        />
      )}
      <FinanceCard title="Audit sesi mock aktif">
        <div className={styles.stack}>
          <Field
            label="Cari aktor, objek atau tindakan"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Contoh: CFG-18, TX-8423"
          />
          {rows.length ? (
            <FinanceTable
              label="Audit keuangan sesi aktif"
              headers={["Waktu", "Aktor", "Objek", "Tindakan", "Hasil"]}
              rows={rows.map((entry) => [
                new Date(entry.at).toLocaleString("id-ID"),
                entry.actor,
                <Button
                  key={entry.id}
                  variant="ghost"
                  size="small"
                  onClick={() => {
                    setDetail(entry);
                    setReason("");
                  }}
                >
                  {entry.objectId}
                </Button>,
                entry.action,
                entry.result,
              ])}
            />
          ) : (
            <FinanceNote>
              {query
                ? "Tidak ada event sesuai filter."
                : "Belum ada perubahan pada sesi ini. Tindakan yang diterima akan menambah audit di sini."}
            </FinanceNote>
          )}
          <FinanceNote>
            Koreksi berupa event baru yang tertaut. Ekspor memerlukan izin dan menyamarkan data
            pribadi, kredensial, serta kode verifikasi.
          </FinanceNote>
          {compact && (
            <Button variant="secondary" onClick={download} disabled={!context.permissions.export}>
              Ekspor audit terbatas
            </Button>
          )}
          {!context.permissions.export && (
            <p className="text-sm text-secondary">
              Ekspor audit tidak tersedia untuk cakupan akun ini.
            </p>
          )}
          {message && (
            <p role="status" className={styles.status}>
              {message}
            </p>
          )}
        </div>
      </FinanceCard>
      <FinanceCard title="Referensi 25 Oktober 2026 · vignette setelah konfirmasi">
        <FinanceNote>
          Contoh berikut terpisah dari sesi aktif. CFG-18 pada referensi tidak mengubah konfigurasi
          aktif v{state.config.version}; WD-105 diterima tidak berarti transfer selesai.
        </FinanceNote>
        <FinanceTable
          label="Vignette audit sumber"
          headers={["Waktu", "Aktor", "Objek", "Tindakan", "Hasil"]}
          rows={historicalFinanceAudit}
        />
        <div className="mt-5">
          <Button variant="secondary" onClick={() => setReference(true)}>
            Lihat detail event referensi
          </Button>
        </div>
      </FinanceCard>
      <Dialog
        open={Boolean(detail)}
        title={`${detail?.id ?? ""} · detail audit`}
        onClose={() => setDetail(null)}
      >
        {detail && (
          <div className={styles.stack}>
            <FinanceTable
              label="Detail audit lokal"
              headers={["Catatan", "Nilai"]}
              rows={[
                [
                  "Objek / versi",
                  `${detail.objectId} · ${detail.beforeVersion} → ${detail.version}`,
                ],
                ["Aktor", detail.actor],
                ["Alasan", detail.reason],
                ["Perubahan", detail.diff ?? detail.result],
                ["Event terkait", detail.linkedId ?? "Tidak ada"],
              ]}
            />
            <Field
              label="Alasan koreksi tertaut"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
            <Button
              disabled={!context.permissions.settings}
              onClick={() => {
                const result = appendFinanceCorrection(state, detail.id, reason, context);
                onResult(result);
                setMessage(result.message);
                if (result.ok) setDetail(null);
              }}
            >
              Tambahkan koreksi baru
            </Button>
            <FinanceNote>
              Event asli dipertahankan. Tidak ada tombol menghapus atau mengubah histori.
            </FinanceNote>
          </div>
        )}
      </Dialog>
      <Dialog
        open={reference}
        title="CFG-18 · contoh audit pascakonfirmasi"
        onClose={() => setReference(false)}
      >
        <div className={styles.stack}>
          <FinanceTable
            label="Referensi perubahan CFG-18"
            headers={["Pengaturan", "Perubahan"]}
            rows={[
              ["Platform fee", "5% → 6% · order baru saja"],
              ["Rekening platform", "BCA ••9087 → Mandiri ••6610"],
              ["Otorisasi", "financial_settings.write · OTP valid saat tindakan"],
              ["Alasan", "Penyesuaian biaya untuk order baru dan rekening penerimaan."],
            ]}
          />
          <FinanceNote>
            Vignette terpisah. Nilai OTP tidak pernah disimpan. Perubahan ini belum diterapkan pada
            sesi aktif kecuali Anda mengonfirmasinya sendiri.
          </FinanceNote>
          <Button variant="secondary" onClick={() => setReference(false)}>
            Tutup detail
          </Button>
        </div>
      </Dialog>
    </>
  );
}
