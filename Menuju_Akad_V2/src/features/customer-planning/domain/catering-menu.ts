import { z } from "zod";

export const cateringMenuSchema = z.object({
  id: z.string().trim().min(1).max(160),
  title: z.string().trim().min(1).max(160),
  notes: z.string().max(2000).optional(),
  portions: z.number().int().min(1).max(100000),
  unitCost: z.number().int().min(0).max(1e9),
  mode: z.enum(["unit", "package"]).optional(),
  pricing: z.enum(["per-person", "total"]).optional(),
  category: z.enum(["buffet", "stall", "dessert", "drinks", "snacks", "other"]).optional(),
  vendor: z.string().trim().max(160).optional(),
  includedMenus: z.string().trim().max(2000).optional(),
});
export type CateringMenu = z.infer<typeof cateringMenuSchema>;

export function cateringCost(item: CateringMenu): number {
  return item.mode === "package" && item.pricing === "total"
    ? item.unitCost
    : item.portions * item.unitCost;
}

export function cateringGuestSummary(data: unknown[] | null) {
  let invitations = 0,
    guests = 0;
  for (const row of data ?? []) {
    if (!row || typeof row !== "object" || !("quota" in row)) continue;
    if (
      typeof row.quota !== "number" ||
      !Number.isInteger(row.quota) ||
      row.quota < 1 ||
      row.quota > 1000
    )
      continue;
    invitations++;
    guests += row.quota;
  }
  return { invitations, guests };
}
