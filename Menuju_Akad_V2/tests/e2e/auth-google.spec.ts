import { expect, test } from "@playwright/test";

let errors: string[] = [];
test.beforeEach(async ({ page }) => {
  errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
});
test.afterEach(() => expect(errors).toEqual([]));

test("displays sanitized error message for Google error query on /login without stale mock note", async ({
  page,
}) => {
  await page.goto("/login?error=OAuthCallbackError");
  await expect(
    page.getByText("Gagal memproses respons autentikasi Google.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Google belum terhubung pada preview ini", { exact: false }),
  ).toHaveCount(0);
});

test("displays sanitized error message for Google error query on /auth/login without stale mock note", async ({
  page,
}) => {
  await page.goto("/auth/login?error=AccessDenied");
  await expect(
    page.getByText("Akses Google dibatalkan atau akun tidak diizinkan.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Google belum terhubung pada preview ini", { exact: false }),
  ).toHaveCount(0);
});

test("displays sanitized error message for prototype or unknown error queries without crashing", async ({
  page,
}) => {
  for (const errorParam of ["__proto__", "constructor", "prototype", "unknown_param"]) {
    await page.goto(`/login?error=${encodeURIComponent(errorParam)}`);
    await expect(
      page.getByText("Terjadi kendala saat autentikasi Google. Silakan coba kembali.", {
        exact: true,
      }),
    ).toBeVisible();
  }
});

test("client-wiring: button initiates Auth.js signin targeting Google provider and server role routing", async ({
  page,
}) => {
  await page.route("**/api/auth/status", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ enabled: true }),
    });
  });

  await page.route("**/api/auth/csrf", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ csrfToken: "mock-csrf-token" }),
    });
  });

  await page.route("**/api/auth/providers", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        google: {
          id: "google",
          name: "Google",
          type: "oidc",
          signinUrl: "/api/auth/signin/google",
          callbackUrl: "/api/auth/callback/google",
        },
      }),
    });
  });

  await page.route("**/api/auth/signin/google**", async (route) => {
    const origin = new URL(route.request().url()).origin;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ url: `${origin}/login?google-wiring=ok` }),
    });
  });

  await page.goto("/login");
  const googleBtn = page.getByRole("button", { name: "Lanjutkan dengan Google" });
  await expect(googleBtn).toBeVisible();

  const signinPromise = page.waitForRequest(
    (req) => req.url().includes("/api/auth/signin/google") && req.method() === "POST",
  );
  await googleBtn.click();
  const signinReq = await signinPromise;

  const params = new URLSearchParams(signinReq.postData() ?? "");
  expect(params.get("callbackUrl")).toBe("/auth/complete?returnTo=%2Fdashboard");
  expect(params.get("csrfToken")).toBe("mock-csrf-token");

  await expect(page).toHaveURL(/.*google-wiring=ok/);
});

test("unconfigured Google auth displays sanitized retryable error and succeeds on retry once enabled", async ({
  page,
}) => {
  let isEnabled = false;

  await page.route("**/api/auth/status", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ enabled: isEnabled }),
    });
  });

  await page.route("**/api/auth/csrf", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ csrfToken: "mock-csrf-token" }),
    });
  });

  await page.route("**/api/auth/providers", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        google: {
          id: "google",
          name: "Google",
          type: "oidc",
          signinUrl: "/api/auth/signin/google",
          callbackUrl: "/api/auth/callback/google",
        },
      }),
    });
  });

  await page.route("**/api/auth/signin/google**", async (route) => {
    const origin = new URL(route.request().url()).origin;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ url: `${origin}/login?google-wiring=ok` }),
    });
  });

  await page.goto("/login");
  const googleBtn = page.getByRole("button", { name: "Lanjutkan dengan Google" });
  await googleBtn.click();

  await expect(
    page.getByText("Layanan masuk dengan Google belum dikonfigurasi.", { exact: true }),
  ).toBeVisible();
  await expect(googleBtn).toBeEnabled();

  isEnabled = true;
  const signinPromise = page.waitForRequest(
    (req) => req.url().includes("/api/auth/signin/google") && req.method() === "POST",
  );
  await googleBtn.click();
  const signinReq = await signinPromise;

  const params = new URLSearchParams(signinReq.postData() ?? "");
  expect(params.get("callbackUrl")).toBe("/auth/complete?returnTo=%2Fdashboard");
  expect(params.get("csrfToken")).toBe("mock-csrf-token");

  await expect(page).toHaveURL(/.*google-wiring=ok/);
});

test("handles status network payload failure gracefully without uncaught console errors", async ({
  page,
}) => {
  await page.route("**/api/auth/status", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: "not-valid-json-response",
    });
  });

  await page.goto("/login");
  const googleBtn = page.getByRole("button", { name: "Lanjutkan dengan Google" });
  await googleBtn.click();

  await expect(
    page.getByText("Gagal menghubungi layanan autentikasi Google. Silakan coba kembali.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(googleBtn).toBeEnabled();
});
