export type InflowSource = {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
  change?: string;
  isIncrease?: boolean;
};

export type ReuiCapitalInflowsProps = {
  title?: string | undefined;
  subtitle?: string | undefined;
  totalAmount: number;
  periodOptions?: string[] | undefined;
  activePeriod?: string | undefined;
  onPeriodChange?: ((period: string) => void) | undefined;
  sources: InflowSource[];
  topCoveragePercent?: number | undefined;
  coverageLabel?: string | undefined;
  restPercentage?: number | undefined;
  footerNote?: string | undefined;
  currencyUnit?: string | undefined;
  manageHref?: string | undefined;
  className?: string | undefined;
};

export const REUI_DONUT_COLORS = [
  "#8b5cf6", // Violet (Northline Capital / Pos 1)
  "#a855f7", // Purple (Copper Market / Pos 2)
  "#c084fc", // Lavender (Bridgewell Fund / Pos 3)
  "#059669", // Emerald fallback
  "#10b981", // Teal fallback
  "#38bdf8", // Sky fallback
];
