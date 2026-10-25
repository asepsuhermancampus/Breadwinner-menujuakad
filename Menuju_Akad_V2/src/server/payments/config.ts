import "server-only";
import { PaymentError } from "./errors";

export type PaymentEnvironment = "production" | "sandbox";

export interface PaymentConfig {
  readonly environment: PaymentEnvironment;
  readonly apiKey: string;
  readonly merchantId: string;
  readonly baseUrl: string;
  readonly callbackUrl?: string;
}

export function getPaymentEnvironment(): PaymentEnvironment {
  const env = process.env["KLIKQRIS_ENV"]?.trim();
  if (env === "production" || env === "sandbox") {
    return env;
  }
  throw new PaymentError("Layanan QRIS belum tersedia", 503);
}

export function isPaymentReady(): boolean {
  try {
    getPaymentConfig();
    return true;
  } catch {
    return false;
  }
}

export function getCallbackUrl(): string | undefined {
  const raw = process.env["KLIKQRIS_CALLBACK_URL"]?.trim();
  if (!raw) {
    return undefined;
  }
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.hash) {
      throw new PaymentError("Callback URL harus berupa alamat HTTPS publik", 503);
    }
    return parsed.toString();
  } catch (err) {
    if (err instanceof PaymentError) throw err;
    throw new PaymentError("Callback URL tidak valid", 503);
  }
}

export function getPaymentConfig(): PaymentConfig {
  const environment = getPaymentEnvironment();
  const apiKey = process.env["KLIKQRIS_API_KEY"]?.trim();
  const merchantId = process.env["KLIKQRIS_MERCHANT_ID"]?.trim();
  if (!apiKey || !merchantId) {
    throw new PaymentError("Layanan QRIS belum tersedia", 503);
  }
  const baseUrl =
    environment === "production" ? "https://klikqris.com/api" : "https://klikqris.com/api/sandbox";
  const callbackUrl = getCallbackUrl();
  if (callbackUrl) {
    return { environment, apiKey, merchantId, baseUrl, callbackUrl };
  }
  return { environment, apiKey, merchantId, baseUrl };
}
