"use client";

import { useEffect, useRef, useState } from "react";
import type { AuthFailure, AuthResult } from "../types/auth-contracts";

export function useAuthRequest() {
  const active = useRef(true);
  const inFlight = useRef(false);
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<AuthFailure | null>(null);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);

  async function run<T>(request: () => Promise<AuthResult<T>>): Promise<AuthResult<T> | null> {
    if (inFlight.current) return null;
    inFlight.current = true;
    setPending(true);
    setFailure(null);
    let result: AuthResult<T>;
    try {
      result = await request();
    } catch {
      result = { ok: false, code: "offline" };
    } finally {
      inFlight.current = false;
      if (active.current) setPending(false);
    }
    if (!active.current) return null;
    if (!result.ok) setFailure(result);
    return result;
  }

  return { run, pending, failure, clearFailure: () => setFailure(null) };
}
