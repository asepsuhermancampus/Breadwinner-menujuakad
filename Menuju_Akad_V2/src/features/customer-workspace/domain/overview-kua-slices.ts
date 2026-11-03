import type { DocumentItem } from "@/features/kua-documents/domain/document-schema";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";

export type KuaCategorization = {
  totalDocs: number;
  completedDocs: number;
  pendingDocs: number;
  mainTotal: number;
  mainCompleted: number;
  additionalTotal: number;
  additionalCompleted: number;
  readinessRate: number;
};

export function categorizeKuaDocs(docs: DocumentItem[]): KuaCategorization {
  const active = docs.filter((d) => !d.archived);
  let completedDocs = 0;
  let mainTotal = 0, mainCompleted = 0;
  let additionalTotal = 0, additionalCompleted = 0;

  for (const d of active) {
    const isCompleted = Boolean(d.completed);
    if (isCompleted) completedDocs += 1;

    if (d.group === "additional") {
      additionalTotal += 1;
      if (isCompleted) additionalCompleted += 1;
    } else {
      mainTotal += 1;
      if (isCompleted) mainCompleted += 1;
    }
  }

  const readinessRate =
    active.length > 0 ? Math.round((completedDocs / active.length) * 100) : 0;

  return {
    totalDocs: active.length,
    completedDocs,
    pendingDocs: active.length - completedDocs,
    mainTotal,
    mainCompleted,
    additionalTotal,
    additionalCompleted,
    readinessRate,
  };
}

export function buildOverviewKuaPartySlices(
  total: number,
  completed: number,
  partyLabel: string,
  baseColor = "#0284c7",
): { slices: DonutSlice[]; centerValue: string; centerLabel: string } {
  if (total <= 0) {
    return { slices: [], centerValue: "0%", centerLabel: partyLabel };
  }

  const completedPercent = Math.round((completed / total) * 100);
  const pendingPercent = Math.max(0, 100 - completedPercent);

  const slices: DonutSlice[] = [];
  if (completedPercent > 0) {
    slices.push({
      id: "completed", label: "Berkas Lengkap", percent: completedPercent,
      amount: completed, color: baseColor,
    });
  }
  if (pendingPercent > 0) {
    slices.push({
      id: "pending", label: "Belum Lengkap", percent: pendingPercent,
      amount: total - completed, color: "#cbd5e1",
    });
  }

  return { slices, centerValue: `${completedPercent}%`, centerLabel: partyLabel };
}
