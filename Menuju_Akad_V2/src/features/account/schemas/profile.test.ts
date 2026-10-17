import { describe, expect, it } from "vitest";
import { deletionSchema, profileSchema } from "./profile";

describe("account input boundaries", () => {
  const profile = {
    fullName: "Risa Pratiwi",
    email: "risa@example.test",
    phone: "0812 3456 7890",
    culture: "Jawa modern",
    expectedVersion: 2,
  };

  it("normalizes an Indonesian phone and keeps the expected version", () => {
    expect(profileSchema.parse(profile)).toMatchObject({
      phone: "+6281234567890",
      expectedVersion: 2,
    });
  });

  it("rejects invalid identity and browser supplied roles", () => {
    expect(profileSchema.safeParse({ ...profile, email: "invalid" }).success).toBe(false);
    expect(profileSchema.safeParse({ ...profile, role: "SUPERADMIN" }).success).toBe(false);
    expect(profileSchema.safeParse({ ...profile, phone: "123" }).success).toBe(false);
  });

  it("requires exact deletion text, acknowledgment, and fresh proof", () => {
    const valid = {
      confirmation: "HAPUS AKUN",
      acknowledged: true,
      proof: "fresh-proof",
    };
    expect(deletionSchema.safeParse(valid).success).toBe(true);
    expect(deletionSchema.safeParse({ ...valid, confirmation: "hapus" }).success).toBe(false);
    expect(deletionSchema.safeParse({ ...valid, acknowledged: false }).success).toBe(false);
    expect(deletionSchema.safeParse({ ...valid, proof: "" }).success).toBe(false);
  });
});
