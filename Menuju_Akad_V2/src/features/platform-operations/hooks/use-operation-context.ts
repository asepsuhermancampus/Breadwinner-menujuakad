"use client";
import { useState } from "react";
import type { GateContext, OperationsRole, Scenario } from "../types/operations";
export function useOperationContext(role: OperationsRole) {
  const [scenario, setScenario] = useState<Scenario>("ready");
  function context(action: string, version: number): GateContext {
    return {
      role,
      scenario,
      action,
      version,
      expectedVersion: version,
      actorId: role === "support" ? "farah" : role === "finance" ? "raka" : "nadia",
      sessionValid: true,
    };
  }
  return { scenario, setScenario, context };
}
