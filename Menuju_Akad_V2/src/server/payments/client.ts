import "server-only";
import { PaymentError } from "./errors";
import { explainProviderRejection } from "./provider-rejection";
import { parseIDRAmount, isValidQrImage, normalizeStatus } from "./validator";

export interface ProviderPaymentData {
  readonly order_id: string;
  readonly amount: number;
  readonly total_amount: number;
  readonly status: "pending" | "paid" | "expired";
  readonly qris_image: string | null;
  readonly expired_at: string | null;
  readonly paid_at: string | null;
  readonly signature: string | null;
}

export interface CreateQRISParams {
  readonly order_id: string;
  readonly amount: number;
  readonly merchant_id: string;
  readonly keterangan: string;
  readonly callback_url?: string;
}

export interface KlikQRISClient {
  createQRIS(params: CreateQRISParams): Promise<ProviderPaymentData>;
  getStatus(order_id: string): Promise<ProviderPaymentData>;
}

export function createKlikQRISClient(
  baseUrl: string,
  apiKey: string,
  merchantId: string,
  fetchImpl: typeof fetch = fetch,
): KlikQRISClient {
  async function request(url: string, init: RequestInit): Promise<ProviderPaymentData> {
    let res: Response;
    try {
      res = await fetchImpl(url, {
        ...init,
        redirect: "error",
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      throw new PaymentError("Gagal menghubungi gateway KlikQRIS", 502);
    }

    if (!res.ok) {
      await explainProviderRejection(res, init.method);
    }

    let json: unknown;
    try {
      json = await res.json();
    } catch {
      throw new PaymentError("Format balasan KlikQRIS bukan JSON valid", 502);
    }

    if (typeof json !== "object" || json === null || !("status" in json) || !("data" in json)) {
      throw new PaymentError("Struktur data balasan KlikQRIS tidak sesuai", 502);
    }

    const payload = json as { status: unknown; data: unknown };
    if (payload.status !== true || typeof payload.data !== "object" || payload.data === null) {
      throw new PaymentError("Permintaan pembayaran ditolak oleh KlikQRIS", 502);
    }

    const d = payload.data as Record<string, unknown>;
    const order_id = typeof d["order_id"] === "string" ? d["order_id"] : "";
    const rawStatus = typeof d["status"] === "string" ? d["status"] : "";
    const status = normalizeStatus(rawStatus);
    let amount: number;
    let total_amount: number;
    try {
      amount = parseIDRAmount(d["amount"]);
      total_amount = parseIDRAmount(d["total_amount"]);
    } catch {
      throw new PaymentError("Nominal tagihan dari KlikQRIS tidak valid", 502);
    }
    if (total_amount < amount) {
      throw new PaymentError("Jumlah transaksi dari KlikQRIS tidak sesuai", 502);
    }

    const rawQr = typeof d["qris_image"] === "string" ? d["qris_image"] : null;
    const qrUrl = typeof d["qris_url"] === "string" ? d["qris_url"] : null;
    const qris_image = isValidQrImage(rawQr) ? rawQr : isValidQrImage(qrUrl) ? qrUrl : null;
    const expired_at = typeof d["expired_at"] === "string" ? d["expired_at"] : null;
    const paid_at = typeof d["paid_at"] === "string" ? d["paid_at"] : null;
    const signature = typeof d["signature"] === "string" ? d["signature"] : null;

    return { order_id, amount, total_amount, status, qris_image, expired_at, paid_at, signature };
  }

  return {
    async createQRIS(params: CreateQRISParams) {
      const headers: Record<string, string> = {
        "x-api-key": apiKey,
        id_merchant: merchantId,
        "Content-Type": "application/json",
      };
      const body: Record<string, unknown> = {
        order_id: params.order_id,
        amount: params.amount,
        id_merchant: params.merchant_id,
        keterangan: params.keterangan,
      };
      if (params.callback_url) {
        body["callback_url"] = params.callback_url;
      }
      return request(`${baseUrl}/qris/create`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
    },
    async getStatus(order_id: string) {
      const headers: Record<string, string> = {
        "x-api-key": apiKey,
        id_merchant: merchantId,
      };
      return request(`${baseUrl}/qris/status/${encodeURIComponent(order_id)}`, {
        method: "GET",
        headers,
      });
    },
  };
}
