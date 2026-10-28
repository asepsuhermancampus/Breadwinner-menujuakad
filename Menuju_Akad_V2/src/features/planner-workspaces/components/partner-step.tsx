"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Status } from "@/components/ui/status";
import type { OnboardingDraft, WorkspaceAdapter } from "../contracts";
import { usePartnerInvite } from "../hooks/use-partner-invite";
import { localInvitePath } from "../utils/invite-policy";
import { LocalInviteQr } from "./local-invite-qr";
import { PartnerBenefits } from "./partner-benefits";

export function PartnerStep({
  draft,
  adapter,
  reload,
}: {
  draft: OnboardingDraft;
  adapter: WorkspaceAdapter;
  reload: () => Promise<void>;
}) {
  const invite = usePartnerInvite(draft, adapter, reload);
  const [copied, setCopied] = useState("");
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const connected =
    invite.state === "used" ||
    draft.members.filter((member) => member.workspaceId === draft.workspaceId).length >= 2;
  const path = draft.invite ? localInvitePath(draft.invite.token) : "";
  const names = `${draft.profile.groom.nickname} & ${draft.profile.bride.nickname}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${path}`);
      setCopied("Tautan lokal disalin. Buka pada perangkat dan browser ini untuk simulasi.");
    } catch {
      setCopied("Salin tautan dari kotak di atas. Akses clipboard browser tidak tersedia.");
    }
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-[minmax(0,540px)_1fr]">
        <Card className="flex min-w-0 flex-col items-center gap-[22px] p-6 text-center md:p-8">
          <h2 className="w-full font-serif text-[42px] leading-tight tracking-[-0.5px] break-words text-brand-secondary">
            {names}
          </h2>
          <p className="text-sm leading-6 text-secondary">
            Satu workspace, dua akun.
            <br />
            Tidak perlu berbagi kata sandi.
          </p>
          <div className="h-px w-full bg-border" />
          {draft.invite && invite.state === "pending" ? (
            <>
              <LocalInviteQr token={draft.invite.token} />
              <p className="text-xs text-secondary">Pindai tautan simulasi lokal untuk bergabung</p>
            </>
          ) : (
            <div className="flex size-36 items-center justify-center rounded-full bg-subtle text-brand-secondary">
              <Icon name={connected ? "check-circle" : "users"} size={48} />
            </div>
          )}
          {path && invite.state === "pending" && (
            <>
              <div className="flex w-full min-w-0 items-center gap-2 rounded-xl bg-subtle px-4 py-2">
                <Link
                  href={path}
                  className="min-w-0 flex-1 break-all text-left font-mono text-xs leading-6"
                >
                  {path}
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Salin tautan pasangan"
                  onClick={() => {
                    void copy();
                  }}
                >
                  <Icon name="copy" size={18} />
                </Button>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  void copy();
                }}
              >
                Salin undangan pasangan
              </Button>
              <p className="text-xs leading-6 text-secondary">
                Tidak mengirim WhatsApp. Tautan hanya untuk preview lokal.
              </p>
              <Status tone="warning">Menunggu pasangan bergabung</Status>
              <p className="text-xs text-secondary">
                Berlaku sampai{" "}
                {new Intl.DateTimeFormat("id-ID", {
                  timeZone: "Asia/Jakarta",
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(draft.invite?.expiresAt ?? adapter.now())}{" "}
                WIB
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  variant="ghost"
                  disabled={invite.busy}
                  onClick={() => {
                    void invite.check();
                  }}
                >
                  Periksa status
                </Button>
                <Button
                  variant="ghost"
                  disabled={invite.busy}
                  onClick={() => setConfirmRevoke(true)}
                >
                  Cabut tautan
                </Button>
              </div>
            </>
          )}
          {connected && <Status tone="success">✓ Dua akun terhubung dalam simulasi lokal</Status>}
          {(invite.state === "expired" || invite.state === "revoked") && (
            <Status tone="warning">
              Tautan {invite.state === "expired" ? "kedaluwarsa" : "sudah dicabut"}. Buat tautan
              baru.
            </Status>
          )}
          {!connected && invite.state !== "pending" && (
            <Button
              disabled={invite.busy}
              className="w-full"
              onClick={() => {
                void invite.create();
              }}
            >
              {invite.busy ? "Menyiapkan…" : "Buat tautan undangan"}
            </Button>
          )}
          {invite.message && <Status tone="danger">{invite.message}</Status>}
          {copied && <Status>{copied}</Status>}
        </Card>
        <PartnerBenefits />
      </div>
      <Dialog
        open={confirmRevoke}
        onClose={() => setConfirmRevoke(false)}
        title="Cabut tautan pasangan?"
      >
        <p className="text-sm leading-7 text-secondary">
          Tautan ini tidak dapat dipakai lagi. Kamu dapat membuat tautan baru setelahnya.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setConfirmRevoke(false)}>
            Batal
          </Button>
          <Button
            variant="danger"
            disabled={invite.busy}
            onClick={() => {
              setConfirmRevoke(false);
              void invite.revoke();
            }}
          >
            Cabut tautan
          </Button>
        </div>
      </Dialog>
    </>
  );
}
