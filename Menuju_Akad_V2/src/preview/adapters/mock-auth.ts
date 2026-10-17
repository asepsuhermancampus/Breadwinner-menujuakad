import { loginSchema, recoverySchema, registerSchema } from "@/features/auth/schemas/auth-schema";
import type { AuthAdapter, AuthResult } from "@/features/auth/types/auth-contracts";
import {
  createAuthChallenge,
  resendAuthChallenge,
  verifyAuthChallenge,
} from "./mock-auth-challenges";
import { resetAuthCredential } from "./mock-auth-reset";
import { createMockAuthStore } from "./mock-auth-store";
import { latency, scenario, systemClock, type Clock } from "./mock-runtime";

export function createMockAuth(clock: Clock = systemClock, wait = latency): AuthAdapter {
  const store = createMockAuthStore(clock);
  async function dispatch<T>(operation: () => AuthResult<T>): Promise<AuthResult<T>> {
    await wait();
    const state = scenario();
    if (state === "offline" || state === "revoked" || state === "conflict")
      return { ok: false, code: state };
    return operation();
  }
  return {
    mode: "mock",
    now: () => clock.now(),
    login: (input) =>
      dispatch(() => {
        const parsed = loginSchema.safeParse(input);
        if (
          !parsed.success ||
          parsed.data.identifier.includes("gagal") ||
          parsed.data.secret === "wrong123"
        )
          return { ok: false, code: "invalid" };
        return createAuthChallenge(
          store,
          "login",
          input.method === "email" ? "r•••@mail.id" : "+62 8•• •••• 7890",
          input.method === "email" ? "password" : "pin",
        );
      }),
    register: (input) =>
      dispatch(() => {
        if (!registerSchema.safeParse(input).success) return { ok: false, code: "invalid" };
        return createAuthChallenge(store, "register", "r•••@mail.id");
      }),
    recover: (input) =>
      dispatch(() => {
        if (!recoverySchema.safeParse(input).success) return { ok: false, code: "invalid" };
        return createAuthChallenge(
          store,
          "recovery",
          "kanal pemulihan terdaftar",
          input.method === "email" ? "password" : "pin",
        );
      }),
    verify: ({ challengeId, code }) =>
      dispatch(() => verifyAuthChallenge(store, challengeId, code)),
    resend: (id) => dispatch(() => resendAuthChallenge(store, id)),
    reset: (input) => dispatch(() => resetAuthCredential(store, input)),
  };
}
