"use client";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { FinanceTabKey } from "../types/finance";
import styles from "./finance.module.css";

type Props = {
  activeTab: FinanceTabKey;
  onTabChange: (tab: FinanceTabKey) => void;
};

const tabs: { key: FinanceTabKey; label: string; icon: string }[] = [
  { key: "ringkasan", label: "Ringkasan", icon: "sparkles" },
  { key: "tabungan", label: "Tabungan", icon: "wallet" },
  { key: "anggaran", label: "Anggaran", icon: "checklist" },
  { key: "pengeluaran", label: "Pengeluaran", icon: "receipt" },
  { key: "termin", label: "Jadwal termin", icon: "calendar" },
  { key: "laporan", label: "Laporan", icon: "documents" },
  { key: "rekening", label: "Rekening & mutasi", icon: "shield" },
];

export function FinanceTabs({ activeTab, onTabChange }: Props) {
  return (
    <nav className={styles.tabsContainer} aria-label="Tab navigasi keuangan">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.key}
          className={cn(styles.tabBtn, activeTab === tab.key && styles.tabBtnActive)}
          onClick={() => onTabChange(tab.key)}
        >
          <Icon name={tab.icon} size={15} />
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
