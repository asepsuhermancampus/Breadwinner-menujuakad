import type { OtpChallenge } from "../types/auth-contracts";

export function challengeTime(
  challenge: Pick<OtpChallenge, "expiresAt" | "resendAt">,
  now: number,
) {
  return {
    expired: now >= challenge.expiresAt,
    resendSeconds: Math.max(0, Math.ceil((challenge.resendAt - now) / 1_000)),
    expirySeconds: Math.max(0, Math.ceil((challenge.expiresAt - now) / 1_000)),
  };
}

export function formatCountdown(seconds: number) {
  return `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}
