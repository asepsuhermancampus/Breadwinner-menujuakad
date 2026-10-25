import { planningSchemas } from "@/features/customer-planning/domain/planning-resource";
import { validGuestIntegrity } from "@/features/guest-crm/utils/guest-integrity";
import "server-only";
import { z } from "zod";
import { PaymentError } from "@/server/payments/errors";
import type { SubscriptionSnapshot } from "@/features/plans/domain/subscription";
import { isStudioDocument } from "@/features/invitation-studio/domain/editor-storage";
const text = z.string().max(2000);
const id = z.string().min(1).max(160);
const guest = z
  .object({
    id,
    name: text,
    group: z.enum(["Keluarga Andi", "Keluarga Risa", "Teman", "Kolega", "Rekanan", "VIP"]),
    quota: z.number().int().min(1).max(1000),
    rsvpStatus: z.enum(["ATTENDING", "DECLINED", "PENDING"]),
    attendingCount: z.number().int().min(0).max(1000),
    waConsent: z.boolean(),
    personalToken: id,
    checkedInCount: z.number().int().min(0).max(1000).optional(),
    contactPhone: z.string().max(80).optional(),
    tableNumber: z.string().max(80).optional(),
    waDraft: text.optional(),
    followUpNote: text.optional(),
  })
  .passthrough();
const task = z.object({
  id,
  title: text,
  pic: z.enum(["Andi", "Risa", "Bersama"]),
  priority: z.enum(["Tinggi", "Normal", "Rendah"]),
  dueDate: text,
  status: z.enum(["Selesai", "Dikerjakan", "Menunggu"]),
  event: z.enum(["wedding", "engagement"]),
  notes: text.optional(),
});
const moodboard = z.object({
  id,
  title: text,
  category: z.enum(["Dekorasi", "Busana", "Detail"]),
  subtitle: text,
  imageSrc: z.string().max(2000).optional(),
  notes: text.optional(),
  vendorRef: text.optional(),
});
const invitation = z.object({
  id,
  title: z.string().min(1).max(160),
  template: z.enum(["basic", "premium"]),
  groom: text.optional(),
  bride: text.optional(),
  date: text.optional(),
  venue: text.optional(),
  published: z.boolean().optional(),
});
const note = z.object({
  id,
  title: text,
  completed: z.boolean().optional(),
  amount: z.number().int().min(0).max(1000000000000).optional(),
  notes: text.optional(),
});
const schemas = {
  ...planningSchemas,
  "vendor-favorites": z.object({ id }),
  guests: guest,
  tasks: task,
  moodboard,
  invitations: invitation,
  documents: note,
  finance: note,
  "studio-drafts": z.object({
    id,
    title: text,
    document: z.record(z.string(), z.unknown()),
    activeDocument: z.record(z.string(), z.unknown()).nullable().optional(),
  }),
};
export type ResourceKind = keyof typeof schemas;
export function isResourceKind(value: string): value is ResourceKind {
  return Object.hasOwn(schemas, value);
}
export function validateResource(
  kind: ResourceKind,
  data: unknown,
  subscription: SubscriptionSnapshot,
): unknown[] {
  const parsed = z.array(schemas[kind]).max(10000).safeParse(data);
  if (!parsed.success) throw new PaymentError("Data fitur tidak valid", 400);
  const items = parsed.data;
  if (kind === "guests" && !validGuestIntegrity(items as z.infer<typeof guest>[]))
    throw new PaymentError("Token tamu duplikat atau jumlah kehadiran melebihi kuota", 400);
  if (new Set(items.map((item) => item.id)).size !== items.length)
    throw new PaymentError("ID data duplikat", 400);
  const has = (name: (typeof subscription.capabilities)[number]) =>
    subscription.capabilities.includes(name);
  if (kind === "guests" && !has("unlimited-guests") && items.length > 100)
    throw new PaymentError("Paket Free maksimal 100 tamu. Pilih Premium untuk menambah tamu.", 403);
  if ((kind === "moodboard" && !has("moodboard")) || (kind === "studio-drafts" && !has("studio")))
    throw new PaymentError("Fitur terkunci pada paket ini", 403);
  if (kind === "invitations") {
    if (items.length > 1 && !has("multi-invitation"))
      throw new PaymentError("Multi-undangan tersedia pada Lifetime", 403);
    if (
      !has("premium-templates") &&
      items.some((item) => "template" in item && item.template === "premium")
    )
      throw new PaymentError("Template premium memerlukan paket Premium", 403);
  }
  if (kind === "studio-drafts") {
    if (
      items.some(
        (item) =>
          !("document" in item) ||
          !isStudioDocument(item.document) ||
          item.document.projectId !== item.id ||
          ("activeDocument" in item &&
            item.activeDocument != null &&
            (!isStudioDocument(item.activeDocument) || item.activeDocument.projectId !== item.id)),
      )
    )
      throw new PaymentError("Draf studio tidak valid", 400);
    if (items.length > 1 && !has("multi-invitation"))
      throw new PaymentError("Beberapa draf undangan memerlukan Lifetime", 403);
  }
  return items;
}
