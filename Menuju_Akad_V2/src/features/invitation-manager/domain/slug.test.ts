import { describe, expect, it } from "vitest";
import { checkSlug, slugSuggestion } from "./slug";

describe("checkSlug", () => {
  it("accepts a valid unused slug", () => {
    expect(checkSlug("andi-risa-14feb2027")).toMatchObject({ status: "AVAILABLE" });
  });

  it("marks taken slugs without leaking the owner", () => {
    const result = checkSlug("  Andi-Risa-Story  ");
    expect(result.status).toBe("TAKEN");
    expect(JSON.stringify(result)).not.toContain("Budi");
    expect(JSON.stringify(result)).not.toContain("Santoso");
  });

  it("rejects the couple's own active slug for a draft", () => {
    expect(checkSlug("andi-risa").status).toBe("INVALID");
  });

  it("enforces length and character rules", () => {
    expect(checkSlug("a").status).toBe("INVALID");
    expect(checkSlug("-LeadingDash").status).toBe("INVALID");
    expect(checkSlug("spasi kosong").status).toBe("INVALID");
  });

  it("keeps the contract suggestion available", () => {
    expect(checkSlug(slugSuggestion)).toMatchObject({ status: "AVAILABLE" });
  });
});
