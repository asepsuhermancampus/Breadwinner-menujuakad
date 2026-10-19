"use client";
import { useState } from "react";
import { createFinanceContext, createFinanceState } from "../content/finance-content";
import type { FinanceResult, FinanceRole } from "../types/admin-finance";

export function useAdminFinance(role: FinanceRole) {
  const [state, setState] = useState(createFinanceState);
  const [notice, setNotice] = useState("");
  const [online, setOnline] = useState(true);
  const [revoked, setRevoked] = useState(false);
  const [sessionValid, setSessionValid] = useState(true);
  const base = createFinanceContext(role);
  const context = {
    ...base,
    online,
    sessionValid,
    permissions: Object.fromEntries(
      Object.entries(base.permissions).map(([key, value]) => [key, value && !revoked]),
    ) as typeof base.permissions,
  };
  function onResult(result: FinanceResult) {
    setState(result.state);
    setNotice(result.message);
  }
  return {
    state,
    context,
    onResult,
    notice,
    setNotice,
    online,
    setOnline,
    revoked,
    setRevoked,
    sessionValid,
    setSessionValid,
  };
}
