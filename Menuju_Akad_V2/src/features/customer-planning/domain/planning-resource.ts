import { z } from "zod";
import { cateringMenuSchema, cateringCost } from "./catering-menu";
const text = z.string().trim().min(1).max(160),
  notes = z.string().max(2000).optional();
const base = { id: text, title: text, notes };
const amount = z.number().int().min(0).max(1e9),
  count = z.number().int().min(1).max(100000);
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((v) => !isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v);
export const planningSchemas = {
  calendar: z
    .object({ ...base, date, startTime: time, endTime: time })
    .refine((v) => v.endTime >= v.startTime, "Waktu selesai mendahului mulai"),
  rundown: z.object({
    ...base,
    order: z.number().int().min(0).max(10000),
    startTime: time,
    pic: z.string().max(160),
  }),
  seserahan: z.object({
    ...base,
    quantity: count,
    unitCost: amount,
    completed: z.boolean().optional(),
  }),
  emergency: z.object({
    ...base,
    category: z.enum(["equipment", "contact"]),
    phone: z.string().max(80).optional(),
    completed: z.boolean().optional(),
  }),
  catering: cateringMenuSchema,
};
export type PlanningKind = keyof typeof planningSchemas;
export type PlanningItem = z.infer<(typeof planningSchemas)[PlanningKind]>;
export function planningTotal(kind: PlanningKind, items: PlanningItem[]): number {
  return items.reduce(
    (sum, item) =>
      sum +
      (kind === "catering" && "portions" in item
        ? cateringCost(item)
        : kind === "seserahan" && "quantity" in item
          ? item.quantity * item.unitCost
          : 0),
    0,
  );
}
