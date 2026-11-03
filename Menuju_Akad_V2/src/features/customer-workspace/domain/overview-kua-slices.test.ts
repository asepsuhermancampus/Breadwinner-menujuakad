import { describe, it, expect } from "vitest";
import type { DocumentItem } from "@/features/kua-documents/domain/document-schema";
import {
  categorizeKuaDocs,
  buildOverviewKuaPartySlices,
} from "./overview-kua-slices";

const sampleDocs: DocumentItem[] = [
  { id: "d1", title: "Fotokopi KTP", group: "main", completed: true, notes: "" },
  { id: "d2", title: "Surat N1", group: "main", completed: false, notes: "" },
  { id: "d3", title: "Fotokopi KK", group: "main", completed: true, notes: "" },
  { id: "d4", title: "Suntik TT", group: "additional", completed: true, notes: "" },
  { id: "d5", title: "Pasfoto 2x3", group: "additional", completed: false, notes: "" },
];

describe("categorizeKuaDocs", () => {
  it("handles empty document list", () => {
    const c = categorizeKuaDocs([]);
    expect(c.totalDocs).toBe(0);
    expect(c.readinessRate).toBe(0);
  });

  it("calculates completion rates by main vs additional group correctly", () => {
    const c = categorizeKuaDocs(sampleDocs);
    expect(c.totalDocs).toBe(5);
    expect(c.completedDocs).toBe(3);
    expect(c.mainTotal).toBe(3);
    expect(c.mainCompleted).toBe(2);
    expect(c.additionalTotal).toBe(2);
    expect(c.additionalCompleted).toBe(1);
    expect(c.readinessRate).toBe(60);
  });
});

describe("buildOverviewKuaPartySlices", () => {
  it("generates percentage ring slices for a group", () => {
    const { slices, centerValue, centerLabel } = buildOverviewKuaPartySlices(
      4,
      3,
      "Berkas Utama",
      "#0284c7",
    );
    expect(slices).toHaveLength(2);
    expect(centerValue).toBe("75%");
    expect(centerLabel).toBe("Berkas Utama");
  });
});
