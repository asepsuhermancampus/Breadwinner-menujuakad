export type OperationsNavItem = {
  label: string;
  icon: string;
  view?: string;
  children?: { label: string; view: string }[];
};
