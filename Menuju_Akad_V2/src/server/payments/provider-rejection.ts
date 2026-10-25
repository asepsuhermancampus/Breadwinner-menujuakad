import { PaymentError } from "./errors";

export class ProviderAmountRejection extends PaymentError {}

export async function explainProviderRejection(response: Response, method: string | undefined) {
  if (response.status === 422 && method === "POST") {
    const body: unknown = await response.json().catch(() => null);
    if (
      body &&
      typeof body === "object" &&
      "status" in body &&
      body.status === false &&
      "errors" in body
    ) {
      const errors = body.errors;
      if (
        errors &&
        typeof errors === "object" &&
        "amount" in errors &&
        Array.isArray(errors.amount) &&
        errors.amount.includes("Nominal transaksi maksimal adalah Rp 300.000.")
      ) {
        throw new ProviderAmountRejection(
          "KlikQRIS membatasi nominal transaksi ini hingga Rp300.000. Hubungi pengelola untuk penyesuaian limit merchant. Tagihan belum dibuat.",
          422,
        );
      }
    }
  }
  throw new PaymentError("Gateway KlikQRIS mengembalikan kode gagal", 502);
}
