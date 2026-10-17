export type MockScenario = "ready" | "offline" | "revoked" | "conflict";
export type Clock = { now(): number };
export const systemClock: Clock = { now: () => Date.now() };

export function scenario(): MockScenario {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return "offline";
  if (typeof sessionStorage === "undefined") return "ready";
  const value = sessionStorage.getItem("ma-v2-scenario");
  return value === "offline" || value === "revoked" || value === "conflict" ? value : "ready";
}
export async function latency() {
  await new Promise<void>((resolve) => setTimeout(resolve, 350));
}
export function readStored(key: string): unknown {
  if (typeof localStorage === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") as unknown;
  } catch {
    return null;
  }
}
export function writeStored(key: string, value: unknown) {
  if (typeof localStorage !== "undefined") localStorage.setItem(key, JSON.stringify(value));
}
export const DEMO_CODE = "882016";
