import { z } from "zod";
import type { AuthMethod } from "../types/auth-contracts";

export function normalizePhone(value: string) {
  const compact = value.trim().replace(/[ ()-]/g, "");
  if (compact.startsWith("08")) return `+62${compact.slice(1)}`;
  if (compact.startsWith("628")) return `+${compact}`;
  return compact;
}

export const emailSchema = z.string().trim().max(254).pipe(z.email("Periksa format alamat email."));
export const phoneSchema = z
  .string()
  .transform(normalizePhone)
  .pipe(
    z.string().regex(/^\+[1-9]\d{7,14}$/, "Masukkan nomor lengkap, misalnya +62 812 3456 7890."),
  );
export const passwordSchema = z
  .string()
  .min(8, "Gunakan minimal 8 karakter.")
  .max(128, "Gunakan maksimal 128 karakter.")
  .regex(/[a-zA-Z]/, "Sertakan huruf dan angka.")
  .regex(/\d/, "Sertakan huruf dan angka.");
export const pinSchema = z.string().regex(/^\d{6}$/, "PIN harus terdiri dari 6 angka.");
export const loginSchema = z.discriminatedUnion("method", [
  z
    .object({
      method: z.literal("email"),
      identifier: emailSchema,
      secret: z.string().min(1).max(128),
      remember: z.boolean(),
    })
    .strict(),
  z
    .object({
      method: z.literal("phone"),
      identifier: phoneSchema,
      secret: pinSchema,
      remember: z.boolean(),
    })
    .strict(),
]);
export const recoverySchema = z.discriminatedUnion("method", [
  z.object({ method: z.literal("email"), identifier: emailSchema }).strict(),
  z.object({ method: z.literal("phone"), identifier: phoneSchema }).strict(),
]);
export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Masukkan nama lengkap.").max(100),
    email: emailSchema,
    password: passwordSchema,
    acceptTerms: z.literal(true, {
      error: "Setujui syarat dan kebijakan privasi untuk melanjutkan.",
    }),
  })
  .strict();

export function identifierSchema(method: AuthMethod) {
  return method === "email" ? emailSchema : phoneSchema;
}

export function firstIssue(result: { error: { issues: { message: string }[] } }) {
  return result.error.issues[0]?.message ?? "Periksa kembali isian Anda.";
}
