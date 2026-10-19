import { describe, expect, it } from "vitest";
import { accountEntries } from "../content/accounts";
import { contentEntries } from "../content/cms";
import type { GateContext } from "../types/operations";
import { mayChangeScope, reviewAccounts } from "./accounts";
import { publishContent, saveContentDraft } from "./cms";
import { prepareMaintenance } from "./maintenance";
const base: GateContext = {
  role: "superadmin",
  action: "cms.write",
  scenario: "ready",
  expectedVersion: 13,
  version: 13,
  actorId: "nadia",
};
describe("global CMS versions", () => {
  const template = contentEntries[0]!;
  it("saves a separate draft without rewriting active text", () => {
    const result = saveContentDraft(template, "Perubahan template baru untuk review.", base);
    expect(result.ok).toBe(true);
    expect(result.entry.active).toBe(12);
    expect(result.entry.publishedText).toBe(template.text);
    expect(template.draft).toBe(13);
    expect(contentEntries[1]!.active).toBe(7);
    expect(contentEntries[4]!.active).toBe(3);
  });
  it("requires explicit SEO, legal, version and acknowledgement review", () => {
    const input = {
      entry: template,
      context: base,
      seo: true,
      legal: true,
      acknowledged: true,
      reason: "Konten global sudah direview.",
    };
    expect(publishContent({ ...input, legal: false }).ok).toBe(false);
    expect(publishContent({ ...input, seo: false }).ok).toBe(false);
    expect(publishContent({ ...input, acknowledged: false }).ok).toBe(false);
    expect(publishContent({ ...input, context: { ...base, expectedVersion: 12 } }).ok).toBe(false);
    expect(publishContent(input).entry.active).toBe(13);
    expect(template.active).toBe(12);
  });
});
describe("per-object account review", () => {
  function review(overrides: Partial<Parameters<typeof reviewAccounts>[0]> = {}) {
    return reviewAccounts({
      accounts: accountEntries,
      selected: ["farah"],
      expectedVersions: { farah: 4 },
      context: base,
      reason: "Tinjauan sesi dan scope terjadwal.",
      acknowledged: true,
      adminCount: 1,
      mode: "sessions",
      ...overrides,
    });
  }
  it("disables empty selection and checks every object's fresh version atomically", () => {
    expect(review({ selected: [] }).ok).toBe(false);
    const result = review({ selected: ["farah", "naya"], expectedVersions: { farah: 4, naya: 4 } });
    expect(result.ok).toBe(false);
    expect(result.accounts).toBe(accountEntries);
    expect(accountEntries[3]!.sessions).toBe(2);
  });
  it("revokes only selected sessions without removing historical account data", () => {
    const result = review();
    expect(result.ok).toBe(true);
    expect(result.accounts[3]!.sessions).toBe(0);
    expect(result.accounts[3]!.scope).toBe(accountEntries[3]!.scope);
    expect(result.accounts[0]).toBe(accountEntries[0]);
  });
  it("protects self authorization and the last administrator", () => {
    expect(mayChangeScope("nadia", "nadia", true)).toBe(false);
    expect(mayChangeScope("nadia", "farah", true)).toBe(false);
    expect(review({ context: { ...base, actorId: "farah" }, mode: "restrict" }).ok).toBe(false);
    const admin = { ...accountEntries[3]!, id: "last-admin", admin: true };
    expect(
      review({
        accounts: [admin],
        selected: [admin.id],
        expectedVersions: { [admin.id]: 4 },
        mode: "restrict",
      }).ok,
    ).toBe(false);
  });
});
it("maintenance prepares only a sandbox proposal and preserves release 43", () => {
  const result = prepareMaintenance(
    "Perbaikan antrean notifikasi",
    "2026-10-25T15:00:00+07:00",
    base,
  );
  expect(result.ok).toBe(true);
  expect(result.message).toContain("Hidden");
  expect(result.message).toContain("review dampak");
  expect(prepareMaintenance("", "invalid", base).ok).toBe(false);
  expect(
    prepareMaintenance("Perbaikan antrean", "2026-10-25T15:00:00+07:00", {
      ...base,
      role: "finance",
    }).ok,
  ).toBe(false);
});
