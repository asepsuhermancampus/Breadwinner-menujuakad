import { createHash } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const mockAuth = vi.fn();
vi.mock("@/server/auth", () => ({
  auth: () => mockAuth(),
}));

const mockService = {
  create: vi.fn(),
  current: vi.fn(),
  refresh: vi.fn(),
  webhook: vi.fn(),
  discountOffer: vi.fn(() => ({
    eligible: true,
    percent: 5,
    originalAmount: 5000,
    discountAmount: 250,
    amount: 4750,
  })),
};
const mockIsPaymentReady = vi.fn(() => true);

vi.mock("@/server/payments/runtime", () => ({
  getPaymentService: () => mockService,
  isPaymentReady: () => mockIsPaymentReady(),
  getPaymentEnvironment: () => "production",
}));

import { GET, POST } from "@/app/api/payments/klikqris/route";
import { GET as getById } from "@/app/api/payments/klikqris/[orderId]/route";

describe("KlikQRIS Route Handlers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsPaymentReady.mockReturnValue(true);
  });

  it("GET /api/payments/klikqris rejects unauthenticated session with 401", async () => {
    mockAuth.mockResolvedValue(null);
    const req = new Request("http://localhost:3201/api/payments/klikqris", { method: "GET" });
    const res = await GET(req);
    expect(res.status).toBe(401);
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    expect(mockService.current).not.toHaveBeenCalled();
  });

  it("POST /api/payments/klikqris rejects unauthenticated session with 401", async () => {
    mockAuth.mockResolvedValue(null);
    const req = new Request("http://localhost:3201/api/payments/klikqris", {
      method: "POST",
      headers: { origin: "http://localhost:3201" },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
    expect(mockService.create).not.toHaveBeenCalled();
  });

  it("POST /api/payments/klikqris rejects forged origin with 403", async () => {
    mockAuth.mockResolvedValue({ user: { email: "user@example.com" } });
    const req = new Request("http://localhost:3201/api/payments/klikqris", {
      method: "POST",
      headers: { origin: "https://malicious-site.com" },
    });
    const res = await POST(req);
    expect(res.status).toBe(403);
    expect(mockService.create).not.toHaveBeenCalled();
  });

  it("blocks creation with no Origin header", async () => {
    mockAuth.mockResolvedValue({ user: { email: "user@example.com" } });
    const res = await POST(
      new Request("http://localhost:3201/api/payments/klikqris", { method: "POST" }),
    );
    expect(res.status).toBe(403);
    expect(mockService.create).not.toHaveBeenCalled();
  });

  it("returns 503 without dispatching when credentials are unavailable", async () => {
    mockAuth.mockResolvedValue({ user: { email: "user@example.com" } });
    mockIsPaymentReady.mockReturnValue(false);
    const res = await POST(
      new Request("http://localhost:3201/api/payments/klikqris", {
        method: "POST",
        headers: { Origin: "http://localhost:3201" },
      }),
    );
    expect(res.status).toBe(503);
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    expect(mockService.create).not.toHaveBeenCalled();
  });

  it("POST /api/payments/klikqris creates invoice with verified owner hash and ignores body", async () => {
    mockAuth.mockResolvedValue({ user: { email: "USER@Example.COM" } });
    mockService.create.mockResolvedValue({
      orderId: "ORD-123",
      amount: 5000,
      totalAmount: 5123,
      status: "pending",
      qrImage: "data:image/png;base64,mock",
      expiresAt: null,
      paidAt: null,
      environment: "production",
    });

    const req = new Request("http://localhost:3201/api/payments/klikqris", {
      method: "POST",
      headers: { origin: "http://localhost:3201", "content-type": "application/json" },
      body: JSON.stringify({ amount: 999999, owner: "attacker" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const expectedHash = createHash("sha256").update("user@example.com").digest("hex");
    expect(mockService.create).toHaveBeenCalledWith(expectedHash);
  });

  it("GET /api/payments/klikqris returns current invoice isolated to session owner", async () => {
    mockAuth.mockResolvedValue({ user: { email: "user@example.com" } });
    mockService.current.mockReturnValue({
      orderId: "ORD-123",
      amount: 5000,
      totalAmount: 5123,
      status: "pending",
      qrImage: null,
      expiresAt: null,
      paidAt: null,
      environment: "production",
    });

    const req = new Request("http://localhost:3201/api/payments/klikqris", { method: "GET" });
    const res = await GET(req);
    expect(res.status).toBe(200);
    const expectedHash = createHash("sha256").update("user@example.com").digest("hex");
    expect(mockService.current).toHaveBeenCalledWith(expectedHash);
  });

  it("GET /api/payments/klikqris/[orderId] validates orderId and refreshes invoice", async () => {
    mockAuth.mockResolvedValue({ user: { email: "user@example.com" } });
    mockService.refresh.mockResolvedValue({
      orderId: "ORD_456",
      amount: 5000,
      totalAmount: 5000,
      status: "paid",
      qrImage: null,
      expiresAt: null,
      paidAt: "2026-10-20T10:00:00Z",
      environment: "production",
    });

    const req = new Request("http://localhost:3201/api/payments/klikqris/ORD_456", {
      method: "GET",
    });
    const res = await getById(req, { params: Promise.resolve({ orderId: "ORD_456" }) });
    expect(res.status).toBe(200);
    const expectedHash = createHash("sha256").update("user@example.com").digest("hex");
    expect(mockService.refresh).toHaveBeenCalledWith(expectedHash, "ORD_456");
  });

  it("GET /api/payments/klikqris/[orderId] rejects invalid orderId format with 400", async () => {
    mockAuth.mockResolvedValue({ user: { email: "user@example.com" } });
    const req = new Request("http://localhost:3201/api/payments/klikqris/bad%20order!", {
      method: "GET",
    });
    const res = await getById(req, { params: Promise.resolve({ orderId: "bad order!" }) });
    expect(res.status).toBe(400);
    expect(mockService.refresh).not.toHaveBeenCalled();
  });
});
