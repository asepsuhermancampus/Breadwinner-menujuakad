import { describe, expect, it } from "vitest";
import { challengeTime, formatCountdown } from "./challenge-time";

describe("challenge clock", () => {
  const challenge = { expiresAt: 100_000, resendAt: 45_000 };
  it("uses injected timestamps for cooldown and expiry", () => {
    expect(challengeTime(challenge, 0)).toEqual({
      expired: false,
      resendSeconds: 45,
      expirySeconds: 100,
    });
    expect(challengeTime(challenge, 45_000).resendSeconds).toBe(0);
    expect(challengeTime(challenge, 100_000).expired).toBe(true);
    expect(challengeTime(challenge, 101_000).expirySeconds).toBe(0);
  });
  it("rounds remaining partial seconds upward", () => {
    expect(challengeTime(challenge, 44_001).resendSeconds).toBe(1);
    expect(formatCountdown(45)).toBe("00:45");
    expect(formatCountdown(125)).toBe("02:05");
  });
});
