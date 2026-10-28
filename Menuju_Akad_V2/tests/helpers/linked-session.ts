import type { Browser, BrowserContext } from "@playwright/test";
import { customerSession } from "./customer-session";
export async function linkedSession(
  owner: BrowserContext,
  browser: Browser,
  baseURL: string,
  label: string,
  side: "groom" | "bride",
  ownName = side === "groom" ? "Suep" : "Latifah",
  partnerName = side === "groom" ? "Latifah" : "Suep",
) {
  await customerSession(owner, baseURL, label);
  const saved = await owner.request.patch("/api/workspace", {
    headers: { Origin: baseURL },
    data: { fullName: `${ownName} Lengkap`, nickname: ownName, side },
  });
  if (!saved.ok()) throw Error(`Owner profile failed: ${saved.status()}`);
  const invitation = await owner.request.post("/api/workspace/partner", {
    headers: { Origin: baseURL },
    data: { action: "invite" },
  });
  if (!invitation.ok()) throw Error(`Invitation failed: ${invitation.status()}`);
  const { token } = (await invitation.json()) as { token: string };
  const child = await browser.newContext({ baseURL });
  await customerSession(child, baseURL, `${label}-partner`);
  const accepted = await child.request.post("/api/workspace/partner", {
    headers: { Origin: baseURL },
    data: { action: "accept", token, fullName: `${partnerName} Lengkap`, nickname: partnerName },
  });
  if (!accepted.ok()) {
    await child.close();
    throw Error(`Acceptance failed: ${accepted.status()}`);
  }
  return child;
}
