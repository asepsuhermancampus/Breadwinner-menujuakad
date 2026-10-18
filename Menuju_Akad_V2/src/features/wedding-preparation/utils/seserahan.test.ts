import { describe, expect, it } from "vitest";
import type { SeserahanItem } from "../types/seserahan";

const sampleSeserahan: SeserahanItem[] = [
  {
    id: "1",
    name: "Set perhiasan",
    category: "Perhiasan",
    estimatedCost: 5_000_000,
    actualCost: 5_000_000,
    isBought: true,
    pic: "Andi",
  },
  {
    id: "2",
    name: "Perlengkapan ibadah",
    category: "Ibadah",
    estimatedCost: 850_000,
    actualCost: 850_000,
    isBought: true,
    pic: "Bersama",
  },
  {
    id: "3",
    name: "Skincare & makeup",
    category: "Perawatan",
    estimatedCost: 1_500_000,
    actualCost: 1_200_000,
    isBought: true,
    pic: "Risa",
  },
  {
    id: "4",
    name: "Busana & kain",
    category: "Busana",
    estimatedCost: 1_500_000,
    actualCost: 0,
    isBought: false,
    pic: "Risa",
  },
  {
    id: "5",
    name: "Tas & sepatu",
    category: "Aksesoris",
    estimatedCost: 950_000,
    actualCost: 0,
    isBought: false,
    pic: "Andi",
  },
  {
    id: "6",
    name: "Buah & kue",
    category: "Konsumsi",
    estimatedCost: 400_000,
    actualCost: 0,
    isBought: false,
    pic: "Bersama",
  },
];

describe("Seserahan arithmetic fixture check", () => {
  it("verifies 6 items, 3 bought, estimated Rp 10.200.000, actual Rp 7.050.000", () => {
    const totalItems = sampleSeserahan.length;
    const boughtCount = sampleSeserahan.filter((s) => s.isBought).length;
    const totalEstimated = sampleSeserahan.reduce((sum, s) => sum + s.estimatedCost, 0);
    const totalActual = sampleSeserahan
      .filter((s) => s.isBought)
      .reduce((sum, s) => sum + s.actualCost, 0);

    expect(totalItems).toBe(6);
    expect(boughtCount).toBe(3);
    expect(totalEstimated).toBe(10_200_000);
    expect(totalActual).toBe(7_050_000);
  });
});
