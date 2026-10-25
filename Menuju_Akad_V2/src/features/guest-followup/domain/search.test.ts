import { describe, it, expect } from "vitest";
import { filterFollowUpGuests } from "./search";
import { followUpGuests } from "../content/followup-content";

describe("filterFollowUpGuests category + name search", () => {
  it("filters guests by exact or partial name matching Hendra", () => {
    const results = filterFollowUpGuests(followUpGuests, "Hendra");
    expect(results).toHaveLength(1);
    expect(results[0]?.name).toBe("Hendra & Partner");
  });

  it("filters guests by category matching Kolega", () => {
    const results = filterFollowUpGuests(followUpGuests, "Kolega");
    expect(results).toHaveLength(1);
    expect(results[0]?.name).toBe("Tono Wijaya");
    expect(results[0]?.category).toBe("Kolega");
  });

  it("filters guests by category matching Keluarga", () => {
    const results = filterFollowUpGuests(followUpGuests, "Keluarga");
    expect(results).toHaveLength(2);
    expect(results.map((g) => g.name)).toEqual(["Salsa Putri", "Bayu & keluarga"]);
  });

  it("handles case-insensitive and trimmed queries", () => {
    const results = filterFollowUpGuests(followUpGuests, "  kOlEgA  ");
    expect(results).toHaveLength(1);
    expect(results[0]?.name).toBe("Tono Wijaya");
  });

  it("returns all guests when query is empty or whitespace", () => {
    const results = filterFollowUpGuests(followUpGuests, "   ");
    expect(results).toHaveLength(followUpGuests.length);
  });
});
