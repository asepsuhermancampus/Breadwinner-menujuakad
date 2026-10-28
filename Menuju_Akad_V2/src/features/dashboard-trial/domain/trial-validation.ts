import { planningSchemas } from "@/features/customer-planning/domain/planning-resource";
import { documentSchema } from "@/features/kua-documents/domain/document-schema";
import { customerBudgetSchema } from "@/features/planner-finance/domain/customer-budget-schema";
import { financeBookSchema } from "@/features/planner-finance/domain/finance-ledger";
import { validGuestIntegrity } from "@/features/guest-crm/utils/guest-integrity";
import { isStudioDocument } from "@/features/invitation-studio/domain/editor-storage";
import { z } from "zod";
import type { TrialResourceKind } from "../types";
const id = z.string().min(1).max(160);
const text = z.string().max(2000);
const schemas = {
  ...planningSchemas,
  "vendor-favorites": z.object({ id }),
  "studio-drafts": z.object({
    id,
    title: text,
    document:
      z.custom<import("@/features/invitation-studio/types/editor").StudioDocument>(
        isStudioDocument,
      ),
    activeDocument: z.null().optional(),
  }),
  tasks: z.object({
    id,
    title: text,
    pic: z.enum(["Andi", "Risa", "Bersama"]),
    priority: z.enum(["Tinggi", "Normal", "Rendah"]),
    dueDate: text,
    status: z.enum(["Selesai", "Dikerjakan", "Menunggu"]),
    event: z.enum(["wedding", "engagement"]),
    notes: text.optional(),
  }),
  guests: z
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
    .passthrough(),
  documents: documentSchema,
  finance: customerBudgetSchema,
  savings: financeBookSchema,
  moodboard: z.object({
    id,
    title: text,
    category: z.enum(["Dekorasi", "Busana", "Detail"]),
    subtitle: text,
    imageSrc: text.optional(),
    notes: text.optional(),
    vendorRef: text.optional(),
  }),
  invitations: z.object({
    id,
    title: z.string().trim().min(1).max(160),
    template: z.enum(["basic", "premium"]),
    groom: text.optional(),
    bride: text.optional(),
    date: text.optional(),
    venue: text.optional(),
    published: z.literal(false).optional(),
  }),
};
export function validateTrialData(kind: TrialResourceKind, data: unknown): unknown[] {
  const max = 10000;
  if (!(kind in schemas)) throw new Error("Jenis data trial belum tersedia.");
  const result = z
    .array(schemas[kind as keyof typeof schemas])
    .max(max)
    .safeParse(data);
  if (!result.success) throw new Error("Data tidak valid atau melampaui batas paket Free.");
  if (kind === "guests" && !validGuestIntegrity(result.data as z.infer<typeof schemas.guests>[]))
    throw new Error("Token tamu duplikat atau jumlah kehadiran melebihi kuota.");
  if (new Set(result.data.map((item) => item.id)).size !== result.data.length)
    throw new Error("ID data duplikat.");
  return result.data;
}
