import { describe, expect, it } from "vitest";
import { initialMessages, tickets } from "../content/helpdesk";
import type { GateContext } from "../types/operations";
import { guardOperation, ownerTicketAccess } from "./guards";
import { canExportHelpdesk, ownerConversation, submitTicketMessage } from "./helpdesk";
const base: GateContext = {
  role: "support",
  action: "tickets.write",
  scenario: "ready",
  expectedVersion: 3,
  version: 3,
  actorId: "farah",
};
const ticket = tickets[0]!;
describe("HDg7g permission, object, event and availability contract", () => {
  it("rejects parent Hidden and child Hidden independently", () => {
    expect(guardOperation({ ...base, availability: "Live", parentAvailability: "Hidden" }).ok).toBe(
      false,
    );
    expect(guardOperation({ ...base, availability: "Hidden", parentAvailability: "Live" }).ok).toBe(
      false,
    );
  });
  it("checks ownership, event delegation and entitlement separately", () => {
    expect(guardOperation({ ...base, ownerId: "andi" }).ok).toBe(false);
    expect(guardOperation({ ...base, ownerId: "andi", assigned: true }).ok).toBe(true);
    expect(guardOperation({ ...base, eventId: "wedding", eventScope: ["engagement"] }).ok).toBe(
      false,
    );
    expect(guardOperation({ ...base, entitlement: false }).ok).toBe(false);
    expect(guardOperation({ ...base, sessionValid: false }).ok).toBe(false);
  });
  it("does not treat OTP or role membership as an action grant", () => {
    expect(guardOperation({ ...base, action: "financial_settings.write" }).ok).toBe(false);
    expect(guardOperation({ ...base, role: "finance", action: "tickets.write" }).ok).toBe(false);
  });
});
describe("private helpdesk conversation", () => {
  function send(internal = false) {
    return submitTicketMessage({
      ticket,
      context: base,
      text: "Jumlah hadir tercatat per sesi.",
      internal,
      messages: initialMessages,
      requestId: "reply-1",
    });
  }
  it("keeps internal notes out of the owner conversation", () => {
    const result = send(true);
    expect(result.ok).toBe(true);
    expect(result.messages).toHaveLength(3);
    expect(ownerConversation(result.messages)).toEqual(initialMessages);
  });
  it("prevents duplicate replies", () => {
    const result = send();
    const again = submitTicketMessage({
      ticket: result.ticket,
      context: { ...base, expectedVersion: result.ticket.version },
      text: "Jumlah hadir tercatat per sesi.",
      internal: false,
      messages: result.messages,
      requestId: "reply-1",
    });
    expect(again.messages).toHaveLength(3);
  });
  it("limits owner mobile to own ticket and denies internal-note creation", () => {
    expect(ownerTicketAccess("andi", "andi", true)).toBe(true);
    expect(ownerTicketAccess("andi", "other", true)).toBe(false);
    expect(ownerTicketAccess("andi", "andi", false)).toBe(false);
    const result = submitTicketMessage({
      ticket,
      context: { ...base, actorId: "andi" },
      text: "Catatan pribadi contoh.",
      internal: true,
      messages: initialMessages,
      requestId: "owner-1",
      ownerMode: true,
    });
    expect(result.ok).toBe(false);
  });
  it("denies unassigned Support cases and sensitive exports", () => {
    const other = tickets[1]!;
    const result = submitTicketMessage({
      ticket: other,
      context: { ...base, expectedVersion: other.version },
      text: "Mohon dibantu pertanyaan ini.",
      internal: false,
      messages: [],
      requestId: "other-1",
    });
    expect(result.ok).toBe(false);
    for (const kind of ["ktp", "bank", "contacts"])
      expect(canExportHelpdesk("support", kind)).toBe(false);
  });
});
