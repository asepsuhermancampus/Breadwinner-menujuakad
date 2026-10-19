"use client";
import { useState, useSyncExternalStore } from "react";
import { ownerConversation, submitTicketMessage } from "../domain/helpdesk";
import type { Feedback, GateContext, Ticket } from "../types/operations";
import { initialThread, readThread, subscribeThread, writeThread } from "./ticket-thread-store";
type DraftPair = { reply: string; note: string };
const drafts = new Map<string, DraftPair>();
export function useTicketThread(
  initial: Ticket,
  context: (action: string, version: number) => GateContext,
  ownerMode: boolean,
) {
  const draftKey = `${initial.id}:${ownerMode ? "owner-andi" : "agent"}`;
  const { ticket, messages } = useSyncExternalStore(
    subscribeThread,
    () => readThread(initial),
    () => initialThread(initial),
  );
  const [draftValues, setDraftValues] = useState<DraftPair>(
    () =>
      drafts.get(draftKey) ?? {
        reply:
          !ownerMode && initial.id === "TK-2048"
            ? "Jumlah hadir Anda tercatat untuk masing-masing sesi."
            : "",
        note: "",
      },
  );
  const [savedValues, setSavedValues] = useState(draftValues);
  const [internal, setInternal] = useState(false);
  const kind = internal ? "note" : "reply";
  const otherKind = internal ? "reply" : "note";
  const draft = draftValues[kind];
  const savedDraft = savedValues[kind];
  const otherDirty = draftValues[otherKind] !== savedValues[otherKind];
  function setDraft(value: string) {
    setDraftValues((current) => ({ ...current, [kind]: value }));
    return value !== savedValues[kind] || otherDirty;
  }
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [saving, setSaving] = useState(false);
  function save() {
    const saved = { ...savedValues, [kind]: draft };
    setSavedValues(saved);
    drafts.set(draftKey, saved);
    setFeedback({ ok: true, message: "Draf disimpan lokal. Belum dikirim ke percakapan." });
  }
  function send() {
    if (saving) return;
    setSaving(true);
    const actor = ownerMode
      ? { ...context("tickets.write", ticket.version), role: "support" as const, actorId: "andi" }
      : context("tickets.write", ticket.version);
    const result = submitTicketMessage({
      ticket: readThread(initial).ticket,
      context: actor,
      text: draft,
      internal,
      messages: readThread(initial).messages,
      requestId: `${ticket.id}:${actor.actorId}:v${ticket.version + 1}`,
      ownerMode,
    });
    setFeedback(result);
    if (result.ok) {
      setDraftValues((current) => ({ ...current, [kind]: "" }));
      setSavedValues((current) => ({ ...current, [kind]: "" }));
      writeThread({ ticket: result.ticket, messages: result.messages });
      drafts.set(draftKey, { ...savedValues, [kind]: "" });
    }
    setSaving(false);
    return result.ok;
  }
  return {
    ticket,
    messages: ownerMode ? ownerConversation(messages) : messages,
    draft,
    setDraft,
    savedDraft,
    otherDirty,
    internal,
    setInternal,
    feedback,
    saving,
    save,
    send,
  };
}
