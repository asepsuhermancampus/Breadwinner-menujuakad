import { describe, expect, it } from "vitest";
import {
  identifierSchema,
  normalizePhone,
  passwordSchema,
  pinSchema,
  registerSchema,
} from "./auth-schema";

describe("auth input boundaries", () => {
  it("normalizes Indonesian display formats without guessing another country", () => {
    expect(normalizePhone("0812 3456-7890")).toBe("+6281234567890");
    expect(normalizePhone("+62 (812) 3456 7890")).toBe("+6281234567890");
    expect(normalizePhone("6281234567890")).toBe("+6281234567890");
    expect(identifierSchema("phone").safeParse("12345").success).toBe(false);
    expect(identifierSchema("phone").parse("+1 2025550123")).toBe("+12025550123");
  });
  it("validates each method and preserves passwords exactly", () => {
    expect(identifierSchema("email").parse(" risa@example.com ")).toBe("risa@example.com");
    expect(identifierSchema("email").safeParse("risa").success).toBe(false);
    expect(passwordSchema.parse(" abcdef12 ")).toBe(" abcdef12 ");
    expect(passwordSchema.safeParse("abcdefgh").success).toBe(false);
    expect(pinSchema.safeParse("123456").success).toBe(true);
    expect(pinSchema.safeParse("12345x").success).toBe(false);
  });
  it("requires explicit consent and a nonempty bounded name", () => {
    const input = {
      name: "Risa",
      email: "risa@example.com",
      password: "Rahasia123",
      acceptTerms: true,
    };
    expect(registerSchema.safeParse(input).success).toBe(true);
    expect(registerSchema.safeParse({ ...input, acceptTerms: false }).success).toBe(false);
    expect(registerSchema.safeParse({ ...input, name: "" }).success).toBe(false);
    expect(registerSchema.safeParse({ ...input, role: "admin" }).success).toBe(false);
  });
});
