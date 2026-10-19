import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OperationDialog as Dialog } from "./operation-panel";
import { Icon } from "@/components/ui/icon";
import { Status } from "@/components/ui/status";
import { tickets } from "../content/helpdesk";
import { useOperationContext } from "../hooks/use-operation-context";
import { useOptionalInstall } from "../hooks/use-optional-install";
import { OperationCard, OperationScenario } from "./operation-ui";
import { TicketConversation } from "./ticket-conversation";
import { OwnerNewTicket } from "./owner-new-ticket";
export function OwnerHelpPanel() {
  const [conversation, setConversation] = useState(false);
  const [creating, setCreating] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [discard, setDiscard] = useState(false);
  const [created, setCreated] = useState<{ title: string; body: string } | null>(null);
  const operation = useOperationContext("support");
  const pwa = useOptionalInstall();
  const ticket = tickets[0]!;
  function close() {
    if (dirty) setDiscard(true);
    else setConversation(false);
  }
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6" data-platform-view="owner-help">
      <p className="text-[10px] font-semibold tracking-[0.24em] text-primary">
        ANDI & RISA · PREMIUM
      </p>
      <h1 className="max-w-xs text-3xl leading-tight font-semibold tracking-tight">
        Ada yang bisa
        <br />
        kami bantu?
      </h1>
      <Button className="w-full bg-primary" onClick={() => setCreating(true)}>
        Buat tiket bantuan
      </Button>
      {created && (
        <OperationCard title={created.title} description="TIKET LOKAL · MENUNGGU SIMULASI">
          <p className="whitespace-pre-wrap text-sm">{created.body}</p>
          <Status tone="success">
            Tiket pribadi baru diterima dalam simulasi lokal. Belum dikirim ke layanan bantuan.
          </Status>
        </OperationCard>
      )}
      <OperationCard title="Jumlah RSVP per sesi" description="TK-2048 · DITANGANI">
        <p className="text-xs font-semibold">Farah · Support</p>
        <p className="text-sm leading-relaxed text-secondary">
          Jawaban tersimpan per sesi. Orang yang sama tidak dihitung dua kali sebagai tamu unik.
        </p>
        <Button variant="secondary" className="w-full" onClick={() => setConversation(true)}>
          Buka percakapan
        </Button>
      </OperationCard>
      <div className="border-t border-ux-border pt-5">
        <h2 className="text-sm font-semibold">Jaga data pribadi</h2>
        <p className="mt-2 text-xs leading-relaxed text-secondary">
          Jangan kirim PIN, OTP, nomor rekening lengkap atau KTP melalui tiket bantuan umum.
        </p>
      </div>
      {!pwa.hidden && (
        <section className="grid gap-4 rounded-card bg-ux-dock p-5">
          <Icon name="download" />
          <h2 className="text-sm font-semibold">Menuju Akad, lebih dekat.</h2>
          <p className="text-xs leading-relaxed text-secondary">
            Tambahkan ke layar utama bila Anda mau. Ini tidak mengaktifkan notifikasi atau menyimpan
            data sensitif secara offline.
          </p>
          <p role="status" className="text-xs leading-relaxed text-secondary">
            {pwa.message}
          </p>
          <div className="flex gap-2">
            <Button disabled={!pwa.available} onClick={pwa.install}>
              Pasang
            </Button>
            <Button variant="ghost" onClick={pwa.defer}>
              Nanti
            </Button>
          </div>
        </section>
      )}
      <nav
        aria-label="Navigasi bantuan pribadi"
        className="flex justify-around border-t border-ux-border pt-4 text-xs"
      >
        <Link href="/dashboard" className="grid min-h-11 justify-items-center gap-2">
          <Icon name="heart" />
          Beranda
        </Link>
        <Link href="/planner/invitations" className="grid min-h-11 justify-items-center gap-2">
          <Icon name="mail" />
          Undangan
        </Link>
        <span aria-current="page" className="grid min-h-11 justify-items-center gap-2 text-primary">
          <Icon name="help" />
          Bantuan
        </span>
      </nav>
      <OperationScenario scenario={operation.scenario} onChange={operation.setScenario} />
      {conversation && (
        <Dialog open onClose={close} title="TK-2048 · percakapan pribadi">
          <div className="grid gap-4">
            {discard && (
              <>
                <Status tone="warning">Draf belum disimpan. Buang perubahan?</Status>
                <Button onClick={() => setDiscard(false)}>Kembali ke percakapan</Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setDiscard(false);
                    setDirty(false);
                    setConversation(false);
                  }}
                >
                  Buang draf dan tutup
                </Button>
              </>
            )}
            <div hidden={discard}>
              <TicketConversation
                ticket={ticket}
                context={operation.context}
                ownerMode
                onDirty={setDirty}
              />
            </div>
          </div>
        </Dialog>
      )}
      {creating && (
        <OwnerNewTicket
          context={operation.context}
          onClose={() => setCreating(false)}
          onCreate={(title, body) => setCreated({ title, body })}
        />
      )}
    </div>
  );
}
