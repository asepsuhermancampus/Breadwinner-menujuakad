import { expect, it, vi } from "vitest";
import { createCustomerEditor } from "./customer-editor";
import { validateResource } from "@/server/workspaces/resource-policy";
import { capabilitiesFor } from "@/features/plans/domain/capabilities";
vi.mock("server-only", () => ({}));
it("validates published snapshots separately from current drafts", () => {
  const document = createCustomerEditor("main").document;
  const subscription = {
    planId: "premium" as const,
    expiresAt: null,
    latestGrantId: null,
    capabilities: capabilitiesFor("premium"),
  };
  const draft = { id: "main", title: document.title, document, activeDocument: document };
  expect(validateResource("studio-drafts", [draft], subscription)[0]).toHaveProperty(
    "activeDocument",
  );
  expect(() =>
    validateResource(
      "studio-drafts",
      [{ ...draft, activeDocument: { projectId: "wrong" } }],
      subscription,
    ),
  ).toThrow();
});
