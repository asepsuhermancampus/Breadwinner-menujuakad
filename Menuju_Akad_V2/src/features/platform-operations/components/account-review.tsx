import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OperationDialog as Dialog } from "./operation-panel";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Status } from "@/components/ui/status";
import { reviewAccounts } from "../domain/accounts";
import type { AccountEntry, Feedback } from "../types/operations";
import type { PanelProps } from "../types/panel";
import { CheckLine } from "./operation-ui";
type Props = Pick<PanelProps, "context"> & {
  accounts: AccountEntry[];
  selected: string[];
  onClose: () => void;
  onSave: (entries: AccountEntry[], message: string) => void;
};
export function AccountReview({ accounts, selected, context, onClose, onSave }: Props) {
  const [versions] = useState(() =>
    Object.fromEntries(accounts.map((account) => [account.id, account.version])),
  );
  const [reason, setReason] = useState("");
  const [ack, setAck] = useState(false);
  const [mode, setMode] = useState<"restrict" | "sessions">("sessions");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [discard, setDiscard] = useState(false);
  function confirm() {
    const result = reviewAccounts({
      accounts,
      selected,
      expectedVersions: versions,
      context: context("accounts.write", 1),
      reason,
      acknowledged: ack,
      adminCount: 1,
      mode,
    });
    setFeedback(result);
    if (result.ok) {
      onSave(result.accounts, result.message);
      onClose();
    }
  }
  return (
    <Dialog
      open
      onClose={() => (reason ? setDiscard(true) : onClose())}
      title="Review tindakan akun"
    >
      <div className="grid gap-4">
        {discard ? (
          <>
            <Status tone="warning">Alasan belum disimpan. Buang perubahan?</Status>
            <Button onClick={() => setDiscard(false)}>Kembali ke review</Button>
            <Button variant="danger" onClick={onClose}>
              Buang perubahan
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm">
              {selected.length} akun dipilih. Setiap akun diperiksa kembali saat konfirmasi;
              perubahan izin tidak menaikkan hak Anda sendiri.
            </p>
            <ul className="grid gap-2 text-xs">
              {accounts
                .filter((account) => selected.includes(account.id))
                .map((account) => (
                  <li key={account.id}>
                    {account.name} · v{account.version} · {account.sessions} sesi aktif
                  </li>
                ))}
            </ul>
            <Select
              label="Tindakan"
              value={mode}
              onChange={(event) => setMode(event.target.value as "sessions" | "restrict")}
            >
              <option value="sessions">Cabut sesi aktif</option>
              <option value="restrict">Batasi akun dan cabut sesi</option>
            </Select>
            <Field
              label="Alasan tindakan"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
            <CheckLine checked={ack} onChange={setAck}>
              Saya telah meninjau scope, versi, dampak sesi dan perlindungan admin terakhir untuk
              semua akun pilihan.
            </CheckLine>
            <Status>
              Owner data dan histori tetap tersedia. Pencabutan sesi ini adalah simulasi lokal.
            </Status>
            {feedback && (
              <Status tone={feedback.ok ? "success" : "danger"}>{feedback.message}</Status>
            )}
            <Button disabled={!ack || reason.trim().length < 8} onClick={confirm}>
              Konfirmasi tindakan simulasi
            </Button>
          </>
        )}
      </div>
    </Dialog>
  );
}
