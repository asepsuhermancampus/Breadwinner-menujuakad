import "server-only";
import { timingSafeEqual } from "node:crypto";
import { PaymentError } from "./errors";

export function parseIDRAmount(value: unknown): number {
  if (typeof value === "number") {
    if (Number.isSafeInteger(value) && value > 0) {
      return value;
    }
    throw new PaymentError("Nominal pembayaran bukan bilangan bulat valid", 400);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!/^\d+(\.00)?$/.test(trimmed)) {
      throw new PaymentError("Format nominal desimal tidak valid", 400);
    }
    const intPart = trimmed.split(".")[0];
    if (!intPart) {
      throw new PaymentError("Nominal pembayaran kosong", 400);
    }
    const parsed = Number(intPart);
    if (Number.isSafeInteger(parsed) && parsed > 0) {
      return parsed;
    }
    throw new PaymentError("Nominal pembayaran di luar batas aman", 400);
  }
  throw new PaymentError("Format nominal harus angka atau teks", 400);
}

export function isValidQrImage(image: string | null | undefined): boolean {
  if (!image) return false;
  if (image.startsWith("data:image/png;base64,")) {
    if (image.length > 1_400_000) return false;
    const encoded = image.slice("data:image/png;base64,".length);
    if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded))
      return false;
    const bytes = Buffer.from(encoded, "base64");
    return (
      bytes.length >= 16 &&
      bytes.toString("base64") === encoded &&
      bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    );
  }
  try {
    const parsed = new URL(image);
    if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.port)
      return false;
    const host = parsed.hostname.toLowerCase();
    if (host !== "klikqris.com" && host !== "www.klikqris.com") return false;
    return parsed.pathname.startsWith("/storage/");
  } catch {
    return false;
  }
}

export function safeCompareSignatures(stored: string, received: string): boolean {
  if (!stored || !received) return false;
  const a = Buffer.from(stored, "utf8");
  const b = Buffer.from(received, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function normalizeStatus(raw: string): "pending" | "paid" | "expired" {
  const upper = raw.trim().toUpperCase();
  if (upper === "SUCCESS" || upper === "PAID") return "paid";
  if (upper === "EXPIRED") return "expired";
  if (upper === "PENDING") return "pending";
  throw new PaymentError("Status transaksi dari penyedia tidak dikenali", 502);
}
