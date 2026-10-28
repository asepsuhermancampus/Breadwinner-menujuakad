import { z } from "zod";

export const customerBudgetSchema = z.object({
  id: z.string().min(1).max(160),
  title: z.string().max(2000),
  amount: z.number().int().min(0).max(1e12).optional(),
  notes: z.string().max(2000).optional(),
  purpose: z.string().max(200).optional(),
  createdAt: z.iso.datetime({ offset: true }).optional(),
  dueDate: z.iso.date().optional(),
  priority: z.enum(["Rendah", "Normal", "Tinggi"]).optional(),
  completed: z.boolean().optional(),
});
