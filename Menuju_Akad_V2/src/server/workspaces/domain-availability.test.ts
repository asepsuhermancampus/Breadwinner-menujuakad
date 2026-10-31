import { expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { capabilitiesFor } from "@/features/plans/domain/capabilities";
import { WorkspaceService } from "./service";
import { DomainService } from "./domain-service";
import { updateFeatureAvailability } from "./feature-availability";
vi.mock("server-only", () => ({}));

it("neutralizes a legacy domain restriction before the feature becomes controllable", () => {
  const database = new PaymentDatabase();
  try {
    const db = database.storage();
    db.exec(
      "CREATE TABLE feature_availability(feature TEXT NOT NULL,audience TEXT NOT NULL,available INTEGER NOT NULL,version INTEGER NOT NULL,PRIMARY KEY(feature,audience))",
    );
    db.prepare("INSERT INTO feature_availability VALUES('domain','owner',0,3)").run();
    new WorkspaceService(db);
    expect(
      db.prepare("SELECT available,version FROM feature_availability WHERE feature='domain'").get(),
    ).toEqual(expect.objectContaining({ available: 1, version: 4 }));
    expect(
      db.prepare("SELECT actor FROM feature_availability_audit WHERE feature='domain'").get(),
    ).toEqual(expect.objectContaining({ actor: "system" }));
  } finally {
    database.close();
  }
});

it("preserves a registered domain while its settings are restricted", () => {
  const database = new PaymentDatabase();
  try {
    const db = database.storage();
    database.reserveInvoice("owner", "production", "domain-order", 1000);
    db.prepare("INSERT INTO subscription_grants VALUES(?,?,?,?,?,?,?)").run(
      "grant",
      "domain-order",
      "owner",
      "lifetime",
      new Date().toISOString(),
      null,
      JSON.stringify(capabilitiesFor("lifetime")),
    );
    const workspaces = new WorkspaceService(db);
    const domain = new DomainService(workspaces);
    const before = domain.requestDomain("owner", "wedding-example.com");
    updateFeatureAvailability(db, "root", "domain", "owner", false, "Uji", 0);
    expect(() => domain.get("owner")).toThrow(/tersedia/i);
    expect(() => domain.requestDomain("owner", "other-wedding.com")).toThrow(/tersedia/i);
    updateFeatureAvailability(db, "root", "domain", "owner", true, "Pulihkan", 1);
    expect(domain.get("owner")).toEqual(before);
  } finally {
    database.close();
  }
});

it("does not update DNS status if access is revoked while verification is pending", async () => {
  const database = new PaymentDatabase();
  try {
    const db = database.storage();
    database.reserveInvoice("owner", "production", "domain-order", 1000);
    db.prepare("INSERT INTO subscription_grants VALUES(?,?,?,?,?,?,?)").run(
      "grant",
      "domain-order",
      "owner",
      "lifetime",
      new Date().toISOString(),
      null,
      JSON.stringify(capabilitiesFor("lifetime")),
    );
    const domain = new DomainService(new WorkspaceService(db));
    const before = domain.requestDomain("owner", "wedding-example.com")!;
    let finish!: (records: string[][]) => void;
    const pending = domain.verifyDomain(
      "owner",
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    updateFeatureAvailability(db, "root", "domain", "owner", false, "Uji", 0);
    finish([[before.challenge]]);
    await expect(pending).rejects.toThrow(/tersedia/i);
    updateFeatureAvailability(db, "root", "domain", "owner", true, "Pulihkan", 1);
    expect(domain.get("owner")).toEqual(before);
  } finally {
    database.close();
  }
});

it("does not let an older DNS check overwrite a newer result", async () => {
  const database = new PaymentDatabase();
  try {
    const db = database.storage();
    database.reserveInvoice("owner", "production", "domain-order", 1000);
    db.prepare("INSERT INTO subscription_grants VALUES(?,?,?,?,?,?,?)").run(
      "grant",
      "domain-order",
      "owner",
      "lifetime",
      new Date().toISOString(),
      null,
      JSON.stringify(capabilitiesFor("lifetime")),
    );
    const domain = new DomainService(new WorkspaceService(db));
    const before = domain.requestDomain("owner", "wedding-example.com")!;
    let finishOld!: (records: string[][]) => void;
    let finishNew!: (records: string[][]) => void;
    const old = domain.verifyDomain(
      "owner",
      () =>
        new Promise((resolve) => {
          finishOld = resolve;
        }),
    );
    const newer = domain.verifyDomain(
      "owner",
      () =>
        new Promise((resolve) => {
          finishNew = resolve;
        }),
    );
    finishNew([[before.challenge]]);
    expect((await newer)?.state).toBe("pending-hosting");
    finishOld([]);
    await expect(old).rejects.toThrow(/berubah|lebih baru/i);
    expect(domain.get("owner")?.state).toBe("pending-hosting");
  } finally {
    database.close();
  }
});
