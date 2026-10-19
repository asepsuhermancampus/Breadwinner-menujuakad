import type { GateContext, OperationsRole, Scenario } from "./operations";
export type PanelProps = {
  role: OperationsRole;
  scenario: Scenario;
  context: (action: string, version: number) => GateContext;
};
