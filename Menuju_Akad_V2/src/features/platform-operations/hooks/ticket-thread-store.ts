import { initialMessages, tickets } from "../content/helpdesk";
import type { Ticket, TicketMessage } from "../types/operations";
type Conversation = { ticket: Ticket; messages: TicketMessage[] };
const initial = new Map<string, Conversation>(
  tickets.map((ticket) => [
    ticket.id,
    { ticket, messages: ticket.id === "TK-2048" ? initialMessages : [] },
  ]),
);
const conversations = new Map<string, Conversation>();
const listeners = new Set<() => void>();
export function subscribeThread(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export function readThread(ticket: Ticket) {
  return conversations.get(ticket.id) ?? initial.get(ticket.id)!;
}
export function initialThread(ticket: Ticket) {
  return initial.get(ticket.id)!;
}
export function writeThread(conversation: Conversation) {
  conversations.set(conversation.ticket.id, conversation);
  listeners.forEach((listener) => listener());
}
