"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { formatRupiah, formatRupiahInput, parseRupiahInput } from "../domain/rupiah";
import type { FinanceCommand, SavingsSide } from "../types/finance-ledger";
import styles from "./customer-savings.module.css";

export function SavingsAdjustmentForm({
  side,
  direction: initialDirection,
  balance,
  pending,
  error,
  onCommand,
  onClose,
}: {
  side: SavingsSide;
  direction: "add" | "subtract";
  balance: number;
  pending: boolean;
  error: string;
  onCommand: (command: FinanceCommand) => Promise<boolean>;
  onClose: () => void;
}) {
  const [direction, setDirection] = useState(initialDirection);
  const [nominal, setNominal] = useState("");
  const [source, setSource] = useState("Gaji");
  const [reason, setReason] = useState("Kebutuhan pribadi");
  const [custom, setCustom] = useState("");
  const [notes, setNotes] = useState("");
  const [validation, setValidation] = useState("");
  const [saving, setSaving] = useState(false);
  const lock = useRef(false);
  const busy = pending || saving;
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy || lock.current) return;
    const amount = parseRupiahInput(nominal);
    const selected = direction === "add" ? source : reason;
    const finalSource = selected === "Lainnya" ? custom.trim() : selected;
    if (!Number.isSafeInteger(amount) || amount <= 0)
      return setValidation("Isi nominal rupiah bulat lebih dari nol, misalnya 1.000.000.");
    if (amount > 1e12) return setValidation("Nominal maksimal Rp 1.000.000.000.000.");
    if (direction === "subtract" && amount > balance)
      return setValidation("Nominal melebihi saldo tabungan yang tersedia.");
    if (!finalSource || (direction === "subtract" && !notes.trim()))
      return setValidation("Lengkapi sumber atau tujuan dan catatan pengurangan.");
    setValidation("");
    lock.current = true;
    setSaving(true);
    try {
      if (
        await onCommand({
          type: "entry",
          side,
          direction,
          amount,
          source: finalSource,
          notes: notes.trim(),
        })
      )
        onClose();
      else setValidation("Perubahan belum tersimpan. Draf tetap tersedia; silakan coba kembali.");
    } catch {
      setValidation("Perubahan belum tersimpan. Draf tetap tersedia; silakan coba kembali.");
    } finally {
      lock.current = false;
      setSaving(false);
    }
  }
  return (
    <Dialog open onClose={() => !busy && onClose()} title="Catat perubahan tabungan">
      <form className={styles.form} onSubmit={(event) => void submit(event)} aria-busy={busy}>
        <p className={styles.muted}>
          Saldo tersedia {formatRupiah(balance)}. Waktu pencatatan diisi otomatis saat disimpan.
        </p>
        <fieldset disabled={busy} className={styles.fields}>
          <legend className="sr-only">Perubahan tabungan</legend>
          <label>
            Jenis perubahan
            <select
              aria-label="Jenis perubahan"
              value={direction}
              onChange={(event) => setDirection(event.target.value as "add" | "subtract")}
            >
              <option value="add">Tambah tabungan</option>
              <option value="subtract">Kurangi tabungan</option>
            </select>
          </label>
          <label>
            Nominal (Rp)
            <input
              autoFocus
              required
              inputMode="numeric"
              autoComplete="off"
              placeholder="1.000.000"
              value={nominal}
              onChange={(event) => {
                const input = event.nativeEvent as InputEvent;
                // Existing grouping dots move when typing/deleting digits. Pasted
                // values still pass strict locale validation before normalization.
                const editingDigits =
                  (input.inputType === "insertText" && /^\d+$/.test(input.data || "")) ||
                  input.inputType?.startsWith("delete");
                setNominal(
                  formatRupiahInput(
                    editingDigits ? event.target.value.replaceAll(".", "") : event.target.value,
                  ),
                );
              }}
            />
          </label>
          {direction === "add" ? (
            <label>
              Sumber dana
              <select
                aria-label="Sumber dana"
                value={source}
                onChange={(event) => setSource(event.target.value)}
              >
                {["Gaji", "Sampingan/Freelance", "Jualan/Dagang", "Lainnya"].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
          ) : (
            <label>
              Tujuan pengurangan
              <select
                aria-label="Tujuan pengurangan"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              >
                {["Kebutuhan pribadi", "Pengeluaran bersama", "Koreksi pencatatan", "Lainnya"].map(
                  (value) => (
                    <option key={value}>{value}</option>
                  ),
                )}
              </select>
            </label>
          )}
          {(direction === "add" ? source : reason) === "Lainnya" && (
            <label>
              {direction === "add" ? "Nama sumber dana" : "Tujuan lainnya"}
              <input
                required
                maxLength={160}
                value={custom}
                onChange={(event) => setCustom(event.target.value)}
              />
            </label>
          )}
          <label>
            Catatan {direction === "subtract" ? "(wajib)" : "(opsional)"}
            <textarea
              aria-label={direction === "subtract" ? "Catatan (wajib)" : "Catatan (opsional)"}
              required={direction === "subtract"}
              rows={3}
              maxLength={2000}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>
        </fieldset>
        {(validation || error) && (
          <p role="alert" className={styles.error}>
            {validation || error}
          </p>
        )}
        <div className={styles.actions}>
          <Button type="submit" disabled={busy}>
            {busy ? "Menyimpan…" : "Simpan perubahan"}
          </Button>
          <Button variant="secondary" disabled={busy} onClick={onClose}>
            Batal
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
