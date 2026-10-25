import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Status } from "@/components/ui/status";
import { useTicketThread } from "../hooks/use-ticket-thread";
import type { GateContext, Ticket } from "../types/operations";
import { Badge } from "./operation-ui";
type Props = {
  ticket: Ticket;
  context: (action: string, version: number) => GateContext;
  ownerMode?: boolean;
  onDirty?: (value: boolean) => void;
};
export function TicketConversation({ ticket, context, ownerMode = false, onDirty }: Props) {
  const draftId = useId();
  const thread = useTicketThread(ticket, context, ownerMode);
  const gateContext = context("tickets.write", ticket.version);
  const isOwner =
    ownerMode || (Boolean(gateContext.actorId) && gateContext.actorId === ticket.ownerId);
  const canRespond = isOwner || ticket.assigned;
  return (
    <div className="grid min-w-0 gap-4">
      <div>
        <Badge>{thread.ticket.status}</Badge>
        <p className="mt-2 text-xs text-secondary">
          {ownerMode
            ? "Percakapan pribadi Anda dengan Farah · Support"
            : "Ditangani Farah · Support · balasan hanya untuk pemilik tiket"}
        </p>
      </div>
      <div
        className="grid max-h-96 gap-3 overflow-y-auto"
        aria-label="Percakapan tiket"
        aria-live="polite"
      >
        {thread.messages.length ? (
          thread.messages.map((message) => (
            <article
              key={message.id}
              className={`rounded-control border border-ux-border p-3 ${message.internal ? "bg-warning-bg" : "bg-surface"}`}
            >
              <p className="text-xs font-semibold">
                {message.author}
                {message.internal ? " · CATATAN INTERNAL" : ""}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed">{message.text}</p>
            </article>
          ))
        ) : (
          <p className="text-xs text-secondary">Belum ada percakapan pada contoh tiket ini.</p>
        )}
      </div>
      {!canRespond ? (
        <Status tone="warning">
          Tiket belum ditugaskan kepada Anda. Respons dinonaktifkan; penugasan tiket diperlukan
          sebelum membalas.
        </Status>
      ) : (
        <>
          {!ownerMode && (
            <Select
              label="Jenis respons"
              value={thread.internal ? "internal" : "reply"}
              onChange={(event) => thread.setInternal(event.target.value === "internal")}
            >
              <option value="reply">Balasan ke pengguna</option>
              <option value="internal">Catatan internal · tidak dikirim</option>
            </Select>
          )}
          <label className="grid gap-2 text-sm font-medium" htmlFor={draftId}>
            Draf {thread.internal ? "catatan internal" : "balasan"}
            <textarea
              id={draftId}
              rows={4}
              maxLength={2000}
              value={thread.draft}
              onChange={(event) => {
                const changed = thread.setDraft(event.target.value);
                onDirty?.(changed);
              }}
              className="w-full min-w-0 resize-y rounded-control border border-ux-control-border bg-surface p-3 text-sm disabled:cursor-not-allowed disabled:bg-subtle disabled:opacity-60"
              aria-describedby={`${draftId}-help`}
            />
          </label>
          <p id={`${draftId}-help`} className="text-xs leading-relaxed text-secondary">
            Catatan internal tidak dikirim ke pengguna. Draf bukan balasan terkirim. Jangan kirim
            PIN, OTP, rekening lengkap atau KTP.
          </p>
          {thread.feedback && (
            <Status tone={thread.feedback.ok ? "success" : "danger"}>
              {thread.feedback.message}
            </Status>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              disabled={!thread.draft.trim()}
              onClick={() => {
                thread.save();
                onDirty?.(thread.otherDirty);
              }}
            >
              Simpan draf
            </Button>
            <Button
              disabled={!thread.draft.trim() || thread.saving}
              onClick={() => {
                if (thread.send()) onDirty?.(thread.otherDirty);
              }}
            >
              {thread.saving
                ? "Menyimpan…"
                : thread.internal
                  ? "Simpan catatan internal"
                  : "Kirim balasan"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
