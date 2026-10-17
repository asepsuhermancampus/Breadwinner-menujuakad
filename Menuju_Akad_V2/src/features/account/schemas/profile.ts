import { z } from "zod";

export function normalizePhone(value: string) {
  const compact = value.replace(/[\s()-]/g, "");
  if (compact.startsWith("0")) return `+62${compact.slice(1)}`;
  if (compact.startsWith("62")) return `+${compact}`;
  return compact;
}

export const profileSchema = z
  .object({
    fullName: z.string().trim().min(2, "Isi nama lengkap.").max(120),
    email: z.email("Periksa kembali alamat email."),
    phone: z
      .string()
      .transform(normalizePhone)
      .pipe(z.string().regex(/^\+[1-9]\d{7,14}$/, "Gunakan nomor telepon yang valid.")),
    culture: z.string().trim().max(100, "Maksimal 100 karakter."),
    expectedVersion: z.number().int().nonnegative(),
  })
  .strict();

export const deletionSchema = z
  .object({
    confirmation: z.literal("HAPUS AKUN"),
    acknowledged: z.literal(true),
    proof: z.string().min(1),
  })
  .strict();
