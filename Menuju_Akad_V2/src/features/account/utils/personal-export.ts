import type { AccountSnapshot } from "../types/account";

export function personalExport(snapshot: AccountSnapshot) {
  return JSON.stringify(
    {
      mode: "UI_MOCK",
      generatedAt: snapshot.asOf,
      profile: snapshot.profile,
      preferences: snapshot.preferences,
      entitlement: snapshot.entitlement,
    },
    null,
    2,
  );
}

export function downloadPersonalExport(snapshot: AccountSnapshot) {
  const url = URL.createObjectURL(
    new Blob([personalExport(snapshot)], { type: "application/json" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "menuju-akad-data-pribadi-simulasi.json";
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 100);
}
