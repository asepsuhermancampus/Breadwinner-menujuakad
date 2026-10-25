import { expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { createSupportRequest } from "./support-service";
import { isOperationsEmail } from "@/server/operations-access";
vi.mock("server-only", () => ({}));
it("requires explicit operator identity and keeps standard tickets unprivileged", () => {
  expect(isOperationsEmail("user@example.com", "")).toBe(false);
  expect(isOperationsEmail("USER@example.com", "user@example.com,other@example.com")).toBe(true);
  expect(isOperationsEmail("user@example.com.evil", "user@example.com")).toBe(false);
  const db = new PaymentDatabase(),
    ws = new WorkspaceService(db.storage());
  expect(createSupportRequest(ws, "a", "Saya perlu bantuan").priority).toBe("standard");
  expect(() => createSupportRequest(ws, "a", "")).toThrow();
  db.close();
});
