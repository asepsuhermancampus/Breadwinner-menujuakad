import type {
  AuthResult,
  AuthVerification,
  CredentialKind,
  OtpChallenge,
} from "@/features/auth/types/auth-contracts";
import type { MockAuthStore } from "./mock-auth-store";
import { DEMO_CODE } from "./mock-runtime";

export function createAuthChallenge(
  store: MockAuthStore,
  purpose: OtpChallenge["purpose"],
  destination: string,
  credentialKind: CredentialKind = "password",
): AuthResult<OtpChallenge> {
  const data: OtpChallenge = {
    id: `mock-challenge-${++store.sequence}`,
    purpose,
    channel: credentialKind === "password" ? "email" : "phone",
    destination,
    expiresAt: store.clock.now() + 300_000,
    resendAt: store.clock.now() + 45_000,
  };
  store.challenges.set(data.id, { challenge: data, credentialKind, used: false, attempts: 0 });
  return { ok: true, data };
}

export function verifyAuthChallenge(
  store: MockAuthStore,
  challengeId: string,
  code: string,
): AuthResult<AuthVerification> {
  const record = store.challenges.get(challengeId);
  if (!record || record.used) return { ok: false, code: "revoked" };
  if (record.challenge.expiresAt <= store.clock.now()) return { ok: false, code: "expired" };
  if (record.attempts >= 5)
    return { ok: false, code: "rate-limit", retryAt: record.challenge.expiresAt };
  if (code !== DEMO_CODE) {
    record.attempts++;
    return { ok: false, code: "wrong-code" };
  }
  record.used = true;
  if (record.challenge.purpose === "recovery") {
    const recoveryToken = `mock-recovery-${++store.sequence}`;
    store.grants.set(recoveryToken, {
      expiresAt: store.clock.now() + 300_000,
      kind: record.credentialKind,
    });
    return {
      ok: true,
      data: { kind: "recovery", recoveryToken, destination: record.challenge.destination },
    };
  }
  return {
    ok: true,
    data: {
      kind: "authenticated",
      session: {
        id: `mock-session-${++store.sequence}`,
        actorId: "actor-risa",
        expiresAt: store.clock.now() + 3_600_000,
      },
    },
  };
}

export function resendAuthChallenge(store: MockAuthStore, id: string): AuthResult<OtpChallenge> {
  const record = store.challenges.get(id);
  if (!record || record.used) return { ok: false, code: "revoked" };
  if (store.clock.now() < record.challenge.resendAt)
    return { ok: false, code: "rate-limit", retryAt: record.challenge.resendAt };
  if (record.attempts >= 5 && store.clock.now() < record.challenge.expiresAt)
    return { ok: false, code: "rate-limit", retryAt: record.challenge.expiresAt };
  record.used = true;
  return createAuthChallenge(
    store,
    record.challenge.purpose,
    record.challenge.destination,
    record.credentialKind,
  );
}
