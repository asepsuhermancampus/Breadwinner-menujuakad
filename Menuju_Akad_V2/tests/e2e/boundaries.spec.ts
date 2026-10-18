import { expect, test } from "@playwright/test";

test("canonical routes fail closed meski ada cookie simulasi", async ({ request }) => {
  for (const route of ["/admin", "/vendor", "/ba"]) {
    const response = await request.get(route, {
      maxRedirects: 0,
      headers: { Cookie: "session=mock-session-admin; role=SUPERADMIN" },
    });
    expect(response.status()).toBe(307);
    // Next emits a same-origin relative Location; assert the resolved target stays
    // on this origin and points at the fail-closed login route.
    const target = new URL(response.headers().location!, "http://127.0.0.1:3200");
    expect(target.origin).toBe("http://127.0.0.1:3200");
    expect(target.pathname).toBe("/login");
  }
  const response = await request.patch("/api/account", { data: { role: "SUPERADMIN" } });
  expect(response.status()).toBe(401);
  expect(await response.json()).toEqual({ ok: false, code: "unauthenticated" });
  expect(response.headers()["cache-control"]).toBe("private, no-store");
});

test("empat alias akun exact307 tetap canonical", async ({ request }) => {
  for (const [route, target] of [
    ["/dashboard/settings", "/account"],
    ["/dashboard/settings/profile", "/account"],
    ["/dashboard/account", "/account"],
    ["/dashboard/settings/security", "/account/security"],
  ]) {
    const response = await request.get(route!, { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers().location).toBe(target);
  }
});

test("root dan login final, segmen invalid ditolak 404", async ({ request }) => {
  const root = await request.get("/", { maxRedirects: 0 });
  expect(root.status()).toBe(200);
  expect(await root.text()).toContain("Rencana besar");
  const login = await request.get("/login");
  expect(login.status()).toBe(200);
  expect(await login.text()).toContain('name="robots" content="noindex, nofollow"');
  for (const route of [
    "/auth/admin",
    "/account/roles/admin",
    "/onboarding/finance",
    "/join/AKAD-882",
  ]) {
    const response = await request.get(route);
    expect(response.status()).toBe(404);
  }
});
