import { describe, expect, it, vi } from "vitest";
import {
  isValidQrImage,
  normalizeStatus,
  parseIDRAmount,
  safeCompareSignatures,
} from "./validator";
import { PaymentError } from "./errors";

vi.mock("server-only", () => ({}));

describe("payments/validator", () => {
  it("parses safe integer IDR amounts and strict .00 decimal strings", () => {
    expect(parseIDRAmount(5000)).toBe(5000);
    expect(parseIDRAmount("5000")).toBe(5000);
    expect(parseIDRAmount("5000.00")).toBe(5000);
    expect(parseIDRAmount("5016.00")).toBe(5016);
  });

  it("rejects permissive or fractional money formats", () => {
    expect(() => parseIDRAmount("5000.50")).toThrow(PaymentError);
    expect(() => parseIDRAmount("5000.0")).toThrow(PaymentError);
    expect(() => parseIDRAmount(-5000)).toThrow(PaymentError);
    expect(() => parseIDRAmount("abc")).toThrow(PaymentError);
  });

  it("validates QR image sources according to strict origin and size policies", () => {
    expect(isValidQrImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==")).toBe(true);
    expect(isValidQrImage("https://klikqris.com/storage/qr/sample.png")).toBe(true);
    expect(isValidQrImage("https://www.klikqris.com/storage/qr/sample.png")).toBe(true);

    expect(isValidQrImage("https://malicious.com/storage/qr.png")).toBe(false);
    expect(isValidQrImage("javascript:alert(1)")).toBe(false);
    expect(isValidQrImage("http://klikqris.com/storage/qr.png")).toBe(false);
    expect(isValidQrImage(null)).toBe(false);
  });

  it.each([
    "data:image/png;base64,invalid",
    "data:image/png;base64,",
    "https://user:password@klikqris.com/storage/qr.png",
    "https://klikqris.com:8443/storage/qr.png",
  ])("rejects unusable or credential-bearing QR sources: %s", (source) => {
    expect(isValidQrImage(source)).toBe(false);
  });

  it("performs constant-time signature comparison", () => {
    expect(safeCompareSignatures("valid-sig-123", "valid-sig-123")).toBe(true);
    expect(safeCompareSignatures("valid-sig-123", "valid-sig-124")).toBe(false);
    expect(safeCompareSignatures("short", "much-longer-signature")).toBe(false);
    expect(safeCompareSignatures("", "any")).toBe(false);
  });

  it("normalizes provider status safely", () => {
    expect(normalizeStatus("SUCCESS")).toBe("paid");
    expect(normalizeStatus("PAID")).toBe("paid");
    expect(normalizeStatus("EXPIRED")).toBe("expired");
    expect(normalizeStatus("PENDING")).toBe("pending");
    expect(() => normalizeStatus("UNKNOWN_STATE")).toThrow(PaymentError);
  });
});
