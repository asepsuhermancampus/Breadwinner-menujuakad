"use client";
import { useState } from "react";
import { AmbassadorScreen } from "@/features/ambassador-operations/components/ambassador-screen";
import { OperationsShell } from "@/features/operations-shell/components/operations-shell";
import { ambassadorNavigation } from "./operations-navigation";
type View = "recruitment" | "ledger" | "withdrawal";
export function PreviewAmbassador() {
  const [view, setView] = useState<View>("recruitment");
  return (
    <OperationsShell
      roleLabel="BRAND AMBASSADOR"
      identity="Sinta Larasati"
      description="Gold Ambassador · 15%"
      account="Sinta Larasati"
      title="Sinta Larasati · Gold 15%"
      active={view}
      items={ambassadorNavigation}
      onNavigate={(next) => setView(next as View)}
    >
      <AmbassadorScreen view={view} />
    </OperationsShell>
  );
}
