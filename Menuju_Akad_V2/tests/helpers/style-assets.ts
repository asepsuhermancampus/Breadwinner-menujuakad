import { expect, type Page, type Request, type Response } from "@playwright/test";

export interface StyleAssetCheckOptions {
  expectedBgColor?: string;
}

export async function assertPageStylesAndAssets(
  page: Page,
  route: string,
  options: StyleAssetCheckOptions = {},
): Promise<void> {
  const failedResources: string[] = [];
  const expectedBg = options.expectedBgColor ?? "rgb(251, 251, 249)";

  const responseHandler = (response: Response): void => {
    const resourceType = response.request().resourceType();
    const url = response.url();
    if (
      resourceType === "stylesheet" ||
      resourceType === "script" ||
      resourceType === "font" ||
      url.includes("/_next/static/")
    ) {
      if (response.status() >= 400) {
        failedResources.push(`HTTP ${response.status()} on ${url} (${resourceType})`);
      }
    }
  };

  const failureHandler = (request: Request): void => {
    const resourceType = request.resourceType();
    if (resourceType === "fetch" || resourceType === "ping" || resourceType === "other") {
      return;
    }
    if (resourceType === "stylesheet" || resourceType === "script" || resourceType === "font") {
      const failure = request.failure();
      failedResources.push(
        `Failed ${resourceType}: ${request.url()} (${failure?.errorText ?? "unknown"})`,
      );
    }
  };

  page.on("response", responseHandler);
  page.on("requestfailed", failureHandler);

  try {
    const response = await page.goto(route, { waitUntil: "load" });
    expect(response?.status()).toBe(200);

    await page.evaluate(() => document.fonts.ready);

    const bodyBg = await page.evaluate(
      () => window.getComputedStyle(document.body).backgroundColor,
    );
    expect(bodyBg).toBe(expectedBg);

    const fontStatus = await page.evaluate(() => {
      const normalize = (name: string): string => name.replace(/['"]/g, "").trim().toLowerCase();

      const computedFamily = window.getComputedStyle(document.body).fontFamily;
      const primaryFamily = normalize(computedFamily.split(",")[0] ?? "");

      const loadedFaces = Array.from(document.fonts).filter((font) => font.status === "loaded");
      const hasLoadedMatch = loadedFaces.some((font) => normalize(font.family) === primaryFamily);

      return {
        hasJakarta: primaryFamily.includes("jakarta"),
        hasLoadedMatch,
      };
    });
    expect(fontStatus.hasJakarta).toBe(true);
    expect(fontStatus.hasLoadedMatch).toBe(true);

    const flexComputed = await page.evaluate(() => {
      const sentinel = document.createElement("div");
      sentinel.className = "flex";
      sentinel.setAttribute("data-test-sentinel", "flex-check");
      document.body.appendChild(sentinel);
      try {
        return window.getComputedStyle(sentinel).display;
      } finally {
        sentinel.remove();
      }
    });
    expect(flexComputed).toBe("flex");

    const hasNoOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    );
    expect(hasNoOverflow).toBe(true);

    expect(failedResources).toEqual([]);
  } finally {
    page.off("response", responseHandler);
    page.off("requestfailed", failureHandler);
  }
}
