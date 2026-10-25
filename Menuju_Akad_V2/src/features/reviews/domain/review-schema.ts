import { z } from "zod";

export const reviewInputSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(80),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(10, "Komentar minimal 10 karakter.").max(2000),
});
export type ReviewInput = z.infer<typeof reviewInputSchema>;
export const moderationSchema = z.object({ status: z.enum(["published", "hidden"]) });
export const loginSchema = z.object({
  email: z.email().trim().max(254),
  password: z.string().min(1).max(128),
});
export const reviewQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(1_000_000).default(1),
  status: z.enum(["pending", "published", "hidden"]).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  search: z.string().trim().max(80).optional(),
});
