"use client";

import { useRef, useState } from "react";
import type { AccountResult } from "../types/account";

export function useAccountOperation() {
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    failed: boolean;
  } | null>(null);

  async function run<T>(
    operation: () => Promise<AccountResult<T>>,
    successMessage: string,
  ): Promise<AccountResult<T>> {
    if (busy.current) {
      return { ok: false, code: "unavailable", message: "Proses masih berjalan." };
    }
    busy.current = true;
    setPending(true);
    setFeedback(null);
    try {
      const result = await operation();
      setFeedback({
        message: result.ok ? successMessage : result.message,
        failed: !result.ok,
      });
      return result;
    } catch {
      const failure = {
        ok: false as const,
        code: "offline" as const,
        message: "Belum tersambung. Draf tetap aman; coba lagi setelah terhubung.",
      };
      setFeedback({ message: failure.message, failed: true });
      return failure;
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return { pending, feedback, run };
}
