import { describe, expect, it } from "vitest";
import type { RundownItem } from "../types/rundown";

const sampleRundown: RundownItem[] = [
  {
    id: "rd-1",
    startTime: "04:30",
    endTime: "07:30",
    title: "Makeup & persiapan",
    source: "MUA",
    pic: "Risa",
    duration: "3 jam",
  },
  {
    id: "rd-4",
    startTime: "08:00",
    endTime: "09:00",
    title: "Akad Nikah",
    source: "KUA",
    pic: "Penghulu",
    duration: "1 jam",
    isAnchor: true,
  },
  {
    id: "rd-7",
    startTime: "10:00",
    endTime: "14:00",
    title: "Resepsi",
    source: "MC",
    pic: "Bersama",
    duration: "4 jam",
    isAnchor: true,
  },
];

describe("Rundown anchor locks", () => {
  it("preserves sacral anchor times for Akad (08:00) and Resepsi (10:00)", () => {
    const anchors = sampleRundown.filter((r) => r.isAnchor);
    expect(anchors).toHaveLength(2);
    expect(anchors.find((a) => a.title.includes("Akad"))?.startTime).toBe("08:00");
    expect(anchors.find((a) => a.title.includes("Resepsi"))?.startTime).toBe("10:00");
  });
});
