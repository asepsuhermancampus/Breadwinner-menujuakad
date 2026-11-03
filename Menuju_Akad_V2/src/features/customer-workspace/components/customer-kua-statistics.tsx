"use client";

import type { DocumentItem } from "@/features/kua-documents/domain/document-schema";
import { DualKuaDonutCard } from "./dual-kua-donut-card";
import { KuaStatusScrollCard } from "./kua-status-scroll-card";
import {
  categorizeKuaDocs,
  buildOverviewKuaPartySlices,
} from "../domain/overview-kua-slices";

export type CustomerKuaStatisticsProps = {
  documents: DocumentItem[];
  partnerNames?: { user: string; partner: string } | undefined;
  ownerSide?: "groom" | "bride" | undefined;
  documentsAvailable?: boolean | undefined;
};

export function CustomerKuaStatistics({
  documents,
  documentsAvailable = true,
}: CustomerKuaStatisticsProps) {
  const c = categorizeKuaDocs(documents);

  const {
    slices: mainSlices,
    centerValue: mainCenterValue,
  } = buildOverviewKuaPartySlices(c.mainTotal, c.mainCompleted, "Berkas Utama", "#0284c7");

  const {
    slices: additionalSlices,
    centerValue: additionalCenterValue,
  } = buildOverviewKuaPartySlices(c.additionalTotal, c.additionalCompleted, "Berkas Khusus", "#8b5cf6");

  const badgeText =
    c.totalDocs > 0
      ? c.readinessRate === 100
        ? "Semua Berkas Siap"
        : `${c.readinessRate}% Berkas Lengkap`
      : undefined;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">
      <DualKuaDonutCard
        className="xl:col-span-2"
        categorization={c}
        mainSlices={mainSlices}
        mainCenterValue={mainCenterValue}
        additionalSlices={additionalSlices}
        additionalCenterValue={additionalCenterValue}
        badgeText={badgeText}
        manageHref={documentsAvailable ? "/planner/kua" : undefined}
      />
      <KuaStatusScrollCard
        className="xl:col-span-1"
        documents={documents}
        documentsAvailable={documentsAvailable}
        manageHref={documentsAvailable ? "/planner/kua" : undefined}
      />
    </div>
  );
}
