import { passwordSchema, pinSchema } from "@/features/auth/schemas/auth-schema";
import type { AuthAdapter, AuthResult } from "@/features/auth/types/auth-contracts";
import type { MockAuthStore } from "./mock-auth-store";

export function resetAuthCredential(
  store: MockAuthStore,
  input: Parameters<AuthAdapter["reset"]>[0],
): AuthResult<{ updated: true }> {
  const grant = store.grants.get(input.recoveryToken);
  if (!grant || grant.expiresAt <= store.clock.now()) return { ok: false, code: "expired" };
  if (grant.kind !== input.kind) return { ok: false, code: "invalid" };
  const schema = input.kind === "pin" ? pinSchema : passwordSchema;
  if (!schema.safeParse(input.secret).success) return { ok: false, code: "invalid" };
  store.grants.delete(input.recoveryToken);
  return { ok: true, data: { updated: true } };
}
