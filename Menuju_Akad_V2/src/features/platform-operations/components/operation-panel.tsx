"use client";
import { createContext, useContext, type ComponentProps, type ReactNode } from "react";
import { Dialog } from "@/components/ui/dialog";
const PanelVisibility = createContext(true);
export const useOperationVisible = () => useContext(PanelVisibility);
export function OperationPanel({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <PanelVisibility value={active}>
      <div className="min-w-0" hidden={!active}>
        <div className="grid min-w-0 gap-6">{children}</div>
      </div>
    </PanelVisibility>
  );
}
export function OperationDialog(props: ComponentProps<typeof Dialog>) {
  const visible = useOperationVisible();
  return <Dialog {...props} open={props.open && visible} />;
}
