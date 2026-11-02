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
  "#087f5b", // Primary Forest Green (Pos 1 / Katering)
  "#10b981", // Emerald Champagne (Pos 2 / Gedung & Venue)
  "#34d399", // Soft Sage / Mint (Pos 3 / Dekorasi)
  "#047857", // Deep Pine
  "#0d9488", // Deep Teal
  "#6ee7b7", // Light Mint
];
