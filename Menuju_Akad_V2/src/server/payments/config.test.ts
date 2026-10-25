import { describe, expect, it, vi, afterEach } from "vitest";
import { getCallbackUrl, getPaymentConfig, getPaymentEnvironment, isPaymentReady } from "./config";
import { PaymentError } from "./errors";

vi.mock("server-only", () => ({}));

describe("payments/config", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("parses production and sandbox environment correctly", () => {
    vi.stubEnv("KLIKQRIS_ENV", "production");
    expect(getPaymentEnvironment()).toBe("production");
    vi.stubEnv("KLIKQRIS_ENV", "sandbox");
    expect(getPaymentEnvironment()).toBe("sandbox");
  });

  it("fails closed on missing or invalid environment", () => {
    delete process.env["KLIKQRIS_ENV"];
    expect(() => getPaymentEnvironment()).toThrow(PaymentError);
    vi.stubEnv("KLIKQRIS_ENV", "staging");
    expect(() => getPaymentEnvironment()).toThrow(PaymentError);
  });

  it("reports ready state accurately depending on credentials presence", () => {
    vi.stubEnv("KLIKQRIS_ENV", "production");
    vi.stubEnv("KLIKQRIS_API_KEY", "test-key");
    vi.stubEnv("KLIKQRIS_MERCHANT_ID", "test-merchant");
    expect(isPaymentReady()).toBe(true);

    vi.stubEnv("KLIKQRIS_API_KEY", "   ");
    expect(isPaymentReady()).toBe(false);
  });

  it("validates callback URL strictly for HTTPS and rejects HTTP or localhost", () => {
    delete process.env["KLIKQRIS_CALLBACK_URL"];
    expect(getCallbackUrl()).toBeUndefined();

    vi.stubEnv("KLIKQRIS_CALLBACK_URL", "https://menujuakad.com/api/payment/webhook");
    expect(getCallbackUrl()).toBe("https://menujuakad.com/api/payment/webhook");

    vi.stubEnv("KLIKQRIS_CALLBACK_URL", "http://localhost:3000/webhook");
    expect(() => getCallbackUrl()).toThrow(PaymentError);
  });

  it("reports invalid callback configuration as unavailable", () => {
    vi.stubEnv("KLIKQRIS_ENV", "production");
    vi.stubEnv("KLIKQRIS_API_KEY", "key");
    vi.stubEnv("KLIKQRIS_MERCHANT_ID", "merchant");
    vi.stubEnv("KLIKQRIS_CALLBACK_URL", "http://localhost:3210/webhook");
    expect(isPaymentReady()).toBe(false);
    expect(() => getPaymentConfig()).toThrow(expect.objectContaining({ httpStatus: 503 }));
  });

  it("constructs complete payment configuration safely", () => {
    vi.stubEnv("KLIKQRIS_ENV", "production");
    vi.stubEnv("KLIKQRIS_API_KEY", "prod-key");
    vi.stubEnv("KLIKQRIS_MERCHANT_ID", "prod-id");
    delete process.env["KLIKQRIS_CALLBACK_URL"];

    const config = getPaymentConfig();
    expect(config.environment).toBe("production");
    expect(config.baseUrl).toBe("https://klikqris.com/api");
    expect(config.callbackUrl).toBeUndefined();
  });
});
