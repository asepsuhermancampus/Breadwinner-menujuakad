"use client";

import { useState } from "react";
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
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Statistik & Analisis Kesiapan
          </h2>
          <p className="text-xs text-secondary">
            Pantau tabungan, anggaran, kehadiran tamu, checklist tugas, berkas KUA, dan kesiapan katering secara real-time.
          </p>
        </div>
      </div>

      {/* Tab Switcher Kategori (Opsi A) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 app-scroll border-b border-ux-border/40 text-xs w-full max-w-full min-w-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0",
              activeTab === tab.id
                ? "bg-emerald-600 text-white shadow-xs font-semibold"
                : "text-secondary hover:text-foreground hover:bg-subtle/50",
            )}
          >
            {tab.label}
          </button>
        ))}
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
