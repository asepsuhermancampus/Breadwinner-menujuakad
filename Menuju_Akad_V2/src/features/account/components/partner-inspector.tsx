"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Status } from "@/components/ui/status";
import { useAccountOperation } from "../hooks/use-account-operation";
import type { AccountAdapter, PartnerProfile } from "../types/account";
import { DirtyDismiss } from "./dirty-dismiss";
import { OperationFeedback } from "./operation-feedback";
import styles from "./account.module.css";

export function PartnerInspector({
  open,
  partner,
  adapter,
  onClose,
  onSaved,
  onUnlinked,
}: {
  open: boolean;
  partner: PartnerProfile;
  adapter: AccountAdapter;
  onClose: () => void;
  onSaved: (partner: PartnerProfile) => void;
  onUnlinked: () => void;
}) {
  const [nickname, setNickname] = useState(partner.nickname);
  const [dirtyClose, setDirtyClose] = useState(false);
  const [confirmUnlink, setConfirmUnlink] = useState(false);
  const [notice, setNotice] = useState("");
  const mutation = useAccountOperation();
  const dirty = nickname !== partner.nickname;

  function close() {
    if (mutation.pending) return;
    if (dirty) setDirtyClose(true);
    else onClose();
  }

  async function save(closeAfter = false) {
    if (!nickname.trim() || nickname.trim().length > 60) {
      setNotice("Isi nama panggilan antara 1 dan 60 karakter.");
      return;
    }
    const result = await mutation.run(
      () => adapter.savePartner({ nickname: nickname.trim(), expectedVersion: partner.version }),
      "Nama panggilan pasangan disimpan pada pratinjau.",
    );
    if (result.ok) {
      onSaved(result.data);
      setNickname(result.data.nickname);
      setDirtyClose(false);
      if (closeAfter) onClose();
    }
  }

  async function unlink() {
    const result = await mutation.run(
      () => adapter.unlinkPartner({ expectedVersion: partner.version }),
      "Tautan pasangan diputus pada pratinjau.",
    );
    if (result.ok && result.data.disconnected) {
      setConfirmUnlink(false);
      onUnlinked();
      onClose();
    }
  }

  return (
    <>
      <Dialog open={open} onClose={close} title="Detail pasangan" side>
        <div className={styles.stack}>
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ux-dock border border-ux-border text-xl text-brand-secondary font-semibold">
              {partner.fullName.charAt(0)}
            </div>
            <h2 className="text-xl font-semibold">{partner.fullName}</h2>
            <p className={styles.description}>Terhubung · Satu ruang rencana bersama</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => setNotice("Pasangan sudah terhubung. Tautan baru tidak diperlukan.")}
            >
              Salin tautan
            </Button>
            <Button
              variant="secondary"
              onClick={() => setNotice("Pratinjau pesan WhatsApp. Tidak ada pesan yang dikirim.")}
            >
              Kirim WhatsApp
            </Button>
          </div>
          {notice && <Status>{notice}</Status>}
          <section className={styles.panel}>
            <h2>Informasi & akses bersama</h2>
            <Field
              label="Nama panggilan"
              value={nickname}
              maxLength={60}
              disabled={mutation.pending}
              onChange={(event) => setNickname(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void save();
                }
                if (event.key === "Escape") {
                  event.preventDefault();
                  event.stopPropagation();
                  setNickname(partner.nickname);
                }
              }}
            />
            <dl className="mt-5 grid gap-4 text-sm">
              <div>
                <dt className="text-secondary">Peran</dt>
                <dd>{partner.roleLabel}</dd>
              </div>
              <div>
                <dt className="text-secondary">Hak akses</dt>
                <dd>{partner.accessLabel}</dd>
              </div>
              <div>
                <dt className="text-secondary">Email</dt>
                <dd className="break-all">{partner.email}</dd>
              </div>
            </dl>
          </section>
          <p className={styles.finePrint}>
            Email dan identitas akun hanya dapat diubah oleh pemiliknya. Enter menyimpan nama
            panggilan; Escape membatalkan edit.
          </p>
          <OperationFeedback feedback={mutation.feedback} />
          <div className={styles.actions}>
            <Button
              variant="danger"
              onClick={() => setConfirmUnlink(true)}
              disabled={mutation.pending}
            >
              Putuskan tautan pasangan…
            </Button>
            <Button onClick={() => void save()} disabled={!dirty || mutation.pending}>
              {mutation.pending ? "Menyimpan…" : "Simpan perubahan"}
            </Button>
          </div>
        </div>
      </Dialog>
      <DirtyDismiss
        open={dirtyClose}
        pending={mutation.pending}
        onContinue={() => setDirtyClose(false)}
        onDiscard={() => {
          setNickname(partner.nickname);
          setDirtyClose(false);
          onClose();
        }}
        onSave={() => void save(true)}
      />
      <Dialog
        open={confirmUnlink}
        onClose={() => setConfirmUnlink(false)}
        title="Putuskan tautan pasangan?"
      >
        <p className={styles.description}>
          Akses kolaborasi pasangan akan dicabut. Ruang lain tidak digabung atau dihapus. Ini
          simulasi lokal.
        </p>
        <OperationFeedback feedback={mutation.feedback} />
        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={() => setConfirmUnlink(false)}
            disabled={mutation.pending}
          >
            Batalkan
          </Button>
          <Button variant="danger" onClick={() => void unlink()} disabled={mutation.pending}>
            {mutation.pending ? "Memproses…" : "Ya, putuskan tautan"}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
