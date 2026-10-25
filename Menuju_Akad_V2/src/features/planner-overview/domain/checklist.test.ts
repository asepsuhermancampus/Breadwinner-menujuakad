import { describe, it, expect } from "vitest";
import { createInitialTaskMap, toggleEventTask } from "./checklist";
import type { FocusTaskItem } from "../types/overview";

describe("checklist per-event map", () => {
  const weddingTask: FocusTaskItem = {
    id: "w-1",
    title: "Finalisasi menu katering",
    pic: "Andi",
    dueDate: "25 Okt 2026",
    completed: false,
  };

  const engagementTask: FocusTaskItem = {
    id: "e-1",
    title: "Pilih bingkisan seserahan",
    pic: "Risa",
    dueDate: "20 Okt 2026",
    completed: false,
  };

  it("preserves checklist state independently per event context without cross-contamination", () => {
    const initial = createInitialTaskMap([weddingTask], [engagementTask]);

    const toggledWedding = toggleEventTask(initial, "wedding", "w-1");
    expect(toggledWedding.wedding[0]?.completed).toBe(true);
    expect(toggledWedding.engagement[0]?.completed).toBe(false);

    const toggledEngagement = toggleEventTask(toggledWedding, "engagement", "e-1");
    expect(toggledEngagement.wedding[0]?.completed).toBe(true);
    expect(toggledEngagement.engagement[0]?.completed).toBe(true);

    const revertedWedding = toggleEventTask(toggledEngagement, "wedding", "w-1");
    expect(revertedWedding.wedding[0]?.completed).toBe(false);
    expect(revertedWedding.engagement[0]?.completed).toBe(true);
  });
});
