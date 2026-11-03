export type InflowSource = {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
  change?: string | undefined;
  isIncrease?: boolean | undefined;
  isPaid?: boolean | undefined;
  statusLabel?: string | undefined;
};

export type DonutSlice = {
  id: string;
  label?: string | undefined;
  percent: number;
  color: string;
  isHatched?: boolean | undefined;
  purpose?: string | undefined;
  amount?: number | undefined;
};

export type ReuiCapitalInflowsProps = {
  title?: string | undefined;
  subtitle?: string | undefined;
  totalAmount: number;
  savingsAmount?: number | undefined;
  periodOptions?: string[] | undefined;
  activePeriod?: string | undefined;
  onPeriodChange?: ((period: string) => void) | undefined;
  sources: InflowSource[];
  donutSlices?: DonutSlice[] | undefined;
  topCoveragePercent?: number | undefined;
  coverageLabel?: string | undefined;
  restPercentage?: number | undefined;
  footerNote?: string | undefined;
  currencyUnit?: string | undefined;
  manageHref?: string | undefined;
  badgeText?: string | undefined;
  badgeSubtext?: string | undefined;
  className?: string | undefined;
};

export const REUI_DONUT_COLORS = [
  "#087f5b", // Primary Forest Green
  "#10b981", // Emerald Champagne
  "#34d399", // Soft Sage / Mint
  "#047857", // Deep Pine
  "#0d9488", // Deep Teal
  "#6ee7b7", // Light Mint
];
