"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type {
  AuthAdapter,
  AuthMethod,
  AuthMode,
  OtpChallenge,
  RecoveryGrant,
} from "../types/auth-contracts";
import { useAuthRequest } from "./use-auth-request";

export function useAuthFlow(mode: AuthMode, adapter: AuthAdapter) {
  const router = useRouter();
  const request = useAuthRequest();
  const [challenge, setChallenge] = useState<OtpChallenge | null>(null);
  const [grant, setGrant] = useState<RecoveryGrant | null>(null);
  const [recoveryMethod, setRecoveryMethod] = useState<AuthMethod>("email");
  const [saved, setSaved] = useState(false);
  const [contractError, setContractError] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!challenge) trigger.current?.focus();
  }, [challenge]);

  async function begin(operation: () => ReturnType<AuthAdapter["login"]>) {
    trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setContractError(false);
    const result = await request.run(operation);
    if (!result?.ok) return;
    if (result.data.purpose !== mode) {
      setContractError(true);
      return;
    }
    setChallenge(result.data);
  }
  async function verify(code: string) {
    if (!challenge) return;
    const result = await request.run(() => adapter.verify({ challengeId: challenge.id, code }));
    if (!result?.ok) return;
    if (mode === "recovery" && result.data.kind === "recovery") {
      setGrant(result.data);
      setChallenge(null);
      return;
    }
    if (
      mode !== "recovery" &&
      result.data.kind === "authenticated" &&
      result.data.session.expiresAt > adapter.now()
    ) {
      setChallenge(null);
      router.push(mode === "register" ? "/preview-ui/onboarding/profile" : "/preview-ui/account");
      return;
    }
    setContractError(true);
    setChallenge(null);
  }
  async function resend() {
    if (!challenge) return;
    const result = await request.run(() => adapter.resend(challenge.id));
    if (!result?.ok) return;
    if (result.data.purpose !== mode) {
      setContractError(true);
      return;
    }
    setChallenge(result.data);
  }
  async function reset(secret: string) {
    if (!grant) return;
    const result = await request.run(() =>
      adapter.reset({
        recoveryToken: grant.recoveryToken,
        kind: recoveryMethod === "email" ? "password" : "pin",
        secret,
      }),
    );
    if (result?.ok) {
      setSaved(true);
      setGrant(null);
    }
  }
  function restartRecovery() {
    setGrant(null);
    setSaved(false);
    request.clearFailure();
    setContractError(false);
  }
  function closeChallenge() {
    if (request.pending) return;
    setChallenge(null);
    request.clearFailure();
  }
  return {
    ...request,
    challenge,
    grant,
    recoveryMethod,
    saved,
    contractError,
    begin,
    verify,
    resend,
    reset,
    restartRecovery,
    closeChallenge,
    setRecoveryMethod,
  };
}
