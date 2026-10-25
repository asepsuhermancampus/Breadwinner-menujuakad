import "server-only";
import path from "node:path";
import { getPaymentConfig, getPaymentEnvironment, isPaymentReady } from "./config";
import { PaymentDatabase } from "./db";
import { createKlikQRISClient } from "./client";
import { PaymentService } from "./service";
import { PlanCheckoutService } from "./plan-checkout-service";

export { getPaymentEnvironment, isPaymentReady };

let serviceInstance: PaymentService | null = null;
let databaseInstance: PaymentDatabase | null = null;
let planInstance: PlanCheckoutService | null = null;

export function getPaymentDatabase(): PaymentDatabase {
  databaseInstance ??= new PaymentDatabase(
    process.env["PAYMENT_DATABASE_PATH"]?.trim() ||
      path.join(process.cwd(), ".data", "klikqris.sqlite"),
  );
  return databaseInstance;
}

export function getPlanCheckoutService(): PlanCheckoutService {
  if (planInstance) return planInstance;
  const config = getPaymentConfig();
  planInstance = new PlanCheckoutService(
    getPaymentDatabase(),
    createKlikQRISClient(config.baseUrl, config.apiKey, config.merchantId),
    config.environment,
    config.merchantId,
    config.callbackUrl,
  );
  return planInstance;
}

export function getPaymentService(): PaymentService {
  if (serviceInstance) {
    return serviceInstance;
  }
  const config = getPaymentConfig();
  const db = getPaymentDatabase();
  const client = createKlikQRISClient(config.baseUrl, config.apiKey, config.merchantId);
  serviceInstance = config.callbackUrl
    ? new PaymentService(db, client, config.environment, config.merchantId, config.callbackUrl)
    : new PaymentService(db, client, config.environment, config.merchantId);
  return serviceInstance;
}
