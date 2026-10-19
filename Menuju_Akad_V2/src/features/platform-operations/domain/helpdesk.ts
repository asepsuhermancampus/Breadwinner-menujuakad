import { accepted, blocked, guardOperation, ownerTicketAccess } from "./guards";
import type { GateContext, Ticket, TicketMessage } from "../types/operations";
export function submitTicketMessage(input: {
  ticket: Ticket;
  context: GateContext;
  text: string;
  internal: boolean;
  messages: TicketMessage[];
  requestId: string;
  ownerMode?: boolean;
}) {
  const { ticket, text, internal, messages, requestId, ownerMode, context } = input;
  const gate = guardOperation({
    ...context,
    action: "tickets.write",
    version: ticket.version,
    ownerId: ticket.ownerId,
    assigned: ownerMode ? false : ticket.assigned,
  });
  if (!gate.ok) return { ...gate, messages, ticket };
  if (ownerMode && (!ownerTicketAccess(ticket.ownerId, context.actorId ?? "", true) || internal))
    return { ...blocked("Hanya percakapan tiket Anda sendiri yang tersedia."), messages, ticket };
  if (!text.trim()) return { ...blocked("Isi pesan sebelum mengirim."), messages, ticket };
  if (/\b(?:\d[\s-]?){10,}\b/.test(text))
    return {
      ...blocked("Hapus nomor sensitif lengkap dari tiket bantuan umum."),
      messages,
      ticket,
    };
  if (messages.some((message) => message.id === requestId))
    return {
      ...accepted("Permintaan yang sama sudah disimpan; duplikat dicegah."),
      messages,
      ticket,
    };
  return {
    ...accepted(
      internal
        ? "Catatan internal tersimpan; tidak dikirim ke pengguna."
        : "Balasan tersimpan dalam percakapan simulasi.",
    ),
    ticket: { ...ticket, version: ticket.version + 1 },
    messages: [
      ...messages,
      {
        id: requestId,
        author: ownerMode
          ? "Andi · sekarang"
          : context.role === "support"
            ? "Farah · Support"
            : "Nadia · Superadmin",
        text: text.trim(),
        internal,
      },
    ],
  };
}
export function ownerConversation(messages: TicketMessage[]) {
  return messages.filter((message) => !message.internal);
}
export function canExportHelpdesk(role: string, kind: string) {
  return role === "superadmin" && !["ktp", "bank", "contacts"].includes(kind);
}
