import { describe, expect, it } from "vitest";
import { documentTemplates } from "./template-catalog";

describe("national KUA document catalog", () => {
  it("includes health, Bimwin certification and examination declarations in the main list", () => {
    const main = documentTemplates.find((template) => template.id === "main")!;
    expect(main.items.join(" ")).toMatch(/Sertifikat.*bimbingan perkawinan/i);
    expect(main.items.join(" ")).toContain("pertanggungjawaban mutlak");
    expect(main.items[8]).toContain("fasilitas kesehatan");
  });

  it("offers a complete conditional aggregate while retaining existing scenario IDs", () => {
    const optional = documentTemplates.find((template) => template.id === "optional")!;
    expect(optional).toBeDefined();
    for (const id of ["outside", "under21", "under19", "divorced", "widowed", "service", "court"]) {
      const scenario = documentTemplates.find((template) => template.id === id)!;
      expect(scenario.group).toBe("additional");
      expect(optional.items.some((title) => title.includes(scenario.items[0]!))).toBe(true);
    }
    expect(optional.items.join(" ")).toMatch(/apostille/i);
    expect(optional.items.join(" ")).toMatch(/taukil wali/i);
    expect(optional.items.join(" ")).toMatch(/10 hari kerja/i);
    expect(optional.items.join(" ")).toMatch(/perjanjian perkawinan.*notaris/i);
  });
});
