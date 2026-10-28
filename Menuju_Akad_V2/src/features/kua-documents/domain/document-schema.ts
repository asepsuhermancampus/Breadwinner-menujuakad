import { z } from "zod";
export const documentSchema = z.object({
  id: z.string().min(1).max(160),
  title: z.string().max(2000),
  completed: z.boolean().optional(),
  notes: z.string().max(2000).optional(),
  group: z.enum(["main", "additional"]).optional(),
  templateId: z.string().min(1).max(80).optional(),
  archived: z.boolean().optional(),
});
export type DocumentItem = {
  id: string;
  title: string;
  completed?: boolean;
  notes?: string;
  group?: "main" | "additional";
  templateId?: string;
  archived?: boolean;
};
