"use client";

import { useState } from "react";
import { PageHeading } from "@/components/ui/page-heading";
import styles from "./customer-statistics.module.css";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import type { GuestInvitation } from "@/features/guest-crm/types/guest";
import type { PlannerTask } from "@/features/planner-tasks/types/tasks";
import type { DocumentItem } from "@/features/kua-documents/domain/document-schema";
import type { SeserahanItem } from "@/features/wedding-preparation/types/seserahan";
import type { OverviewResources } from "../hooks/use-overview-resources";
import { cn } from "@/lib/cn";
import { CustomerFinanceStatistics } from "./customer-finance-statistics";
import { CustomerGuestStatistics } from "./customer-guest-statistics";
import { CustomerTaskStatistics } from "./customer-task-statistics";
import { CustomerKuaStatistics } from "./customer-kua-statistics";
import { CustomerCateringStatistics } from "./customer-catering-statistics";
import { CustomerSeserahanStatistics } from "./customer-seserahan-statistics";

type StatisticsTab = "all" | "finance" | "guests" | "tasks" | "kua" | "catering" | "seserahan";

type StatisticsProps = {
  tasks?: PlannerTask[] | undefined;
  resources: OverviewResources;
  savingsAmount?: number | undefined;
  financeBalances?: { groom: number; bride: number; total: number } | undefined;
  hasPartner?: boolean | undefined;
  partnerNames?: { user: string; partner: string } | undefined;
  ownerSide?: "groom" | "bride" | undefined;
  tasksAvailable?: boolean | undefined;
  financeAvailable?: boolean | undefined;
  guestsAvailable?: boolean | undefined;
  documentsAvailable?: boolean | undefined;
};

export function CustomerStatistics({
  tasks = [],
  resources,
  savingsAmount = 0,
  financeBalances,
  hasPartner = false,
  partnerNames = { user: "Saya", partner: "Pasangan" },
  ownerSide = "groom",
  tasksAvailable = true,
  financeAvailable = true,
  guestsAvailable = true,
  documentsAvailable = true,
}: StatisticsProps) {
  const [activeTab, setActiveTab] = useState<StatisticsTab>("all");

  const financeData = (resources.finance?.data ?? []) as CustomerBudget[];
  const guestData = (resources.guests?.data ?? []) as GuestInvitation[];
  const docData = (resources.documents?.data ?? []) as DocumentItem[];
  const seserahanData = (resources.seserahan?.data ?? []) as SeserahanItem[];

  const tabs: Array<{ id: StatisticsTab; label: string }> = [
    { id: "all", label: "Semua Bidang" },
    { id: "finance", label: "Keuangan & Anggaran" },
    { id: "guests", label: "Tamu & RSVP" },
    { id: "tasks", label: "Checklist Tugas" },
    { id: "kua", label: "Dokumen KUA" },
    { id: "catering", label: "Katering" },
    { id: "seserahan", label: "Seserahan" },
  ];

  return (
    <section className="mt-6 space-y-5 w-full max-w-full min-w-0" aria-label="Statistik perencanaan">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <PageHeading
            id="statistics-heading"
            level={2}
            title="Statistik & Analisis Kesiapan"
            description={
              <div className="space-y-1.5 text-xs">
                <p className="font-semibold text-foreground">Tentang Statistik &amp; Analisis Kesiapan</p>
                <p className="text-secondary leading-relaxed">
                  Grafik visual interaktif untuk memantau progres persiapan secara real-time. Anda dapat beralih antar-tab bidang dan mengeklik irisan diagram lingkaran untuk memfokuskan rincian di kartu sebelah kanan.
                </p>
              </div>
            }
            headingClassName="text-sm sm:text-base font-semibold text-foreground tracking-tight"
          />
          <p className="text-[11.5px] sm:text-xs text-secondary mt-0.5">
            Pantau tabungan, anggaran, kehadiran tamu, checklist tugas, berkas KUA, dan kesiapan katering secara real-time.
          </p>
        </div>
      </div>

      {/* Tab Switcher Kategori (Scrollable horizontal 1 line, style dock seperti Checklist & Tugas) */}
      <div className={styles.tabScrollContainer}>
        <div
          data-dock="true"
          className={styles.tabDock}
          role="tablist"
          aria-label="Kategori bidang statistik kesiapan"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                styles.tabItem,
                activeTab === tab.id && styles.tabItemActive,
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6 w-full max-w-full min-w-0">
        {/* 1. Keuangan & Anggaran */}
        {financeAvailable && (activeTab === "all" || activeTab === "finance") && (
          <CustomerFinanceStatistics
            financeData={financeData}
            savingsAmount={savingsAmount}
            financeBalances={financeBalances}
            hasPartner={hasPartner}
            partnerNames={partnerNames}
            ownerSide={ownerSide}
            financeAvailable={financeAvailable}
          />
        )}

        {/* 2. Tamu & RSVP */}
        {guestsAvailable && (activeTab === "all" || activeTab === "guests") && (
          <CustomerGuestStatistics
            guestData={guestData}
            partnerNames={partnerNames}
            ownerSide={ownerSide}
            guestsAvailable={guestsAvailable}
          />
        )}

        {/* 3. Checklist & Tugas */}
        {tasksAvailable && (activeTab === "all" || activeTab === "tasks") && (
          <CustomerTaskStatistics
            tasks={tasks}
            partnerNames={partnerNames}
            ownerSide={ownerSide}
            tasksAvailable={tasksAvailable}
          />
        )}

        {/* 4. Dokumen KUA */}
        {documentsAvailable && (activeTab === "all" || activeTab === "kua") && (
          <CustomerKuaStatistics
            documents={docData}
            partnerNames={partnerNames}
            ownerSide={ownerSide}
            documentsAvailable={documentsAvailable}
          />
        )}

        {/* 5. Katering */}
        {(activeTab === "all" || activeTab === "catering") && (
          <CustomerCateringStatistics
            guestQuota={guestData.reduce((sum, g) => sum + (g.quota || 0), 0)}
          />
        )}

        {/* 6. Seserahan */}
        {(activeTab === "all" || activeTab === "seserahan") && (
          <CustomerSeserahanStatistics
            items={seserahanData}
          />
        )}
      </div>
    </section>
  );
}
