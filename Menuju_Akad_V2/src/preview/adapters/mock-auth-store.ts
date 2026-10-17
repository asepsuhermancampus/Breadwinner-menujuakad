import type { CredentialKind, OtpChallenge } from "@/features/auth/types/auth-contracts";
import type { Clock } from "./mock-runtime";

export type MockAuthStore = {
  clock: Clock;
  sequence: number;
  challenges: Map<
    string,
    {
      challenge: OtpChallenge;
      credentialKind: CredentialKind;
      used: boolean;
      attempts: number;
    }
  >;
  grants: Map<string, { expiresAt: number; kind: CredentialKind }>;
};

export function createMockAuthStore(clock: Clock): MockAuthStore {
  return { clock, sequence: 0, challenges: new Map(), grants: new Map() };
}
