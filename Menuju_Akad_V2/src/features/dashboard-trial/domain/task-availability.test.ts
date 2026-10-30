import { expect, it, vi } from "vitest";
import { planningAvailability, taskAvailability, vendorAvailability } from "./task-availability";

it("only permits a trial task save when the current server status is active", async () => {
  expect(
    await taskAvailability(vi.fn().mockResolvedValue(new Response('{"status":"active"}'))),
  ).toBe("active");
  expect(
    await taskAvailability(vi.fn().mockResolvedValue(new Response('{"status":"maintenance"}'))),
  ).toBe("maintenance");
  expect(
    await taskAvailability(vi.fn().mockResolvedValue(new Response('{"status":"unknown"}'))),
  ).toBe("unavailable");
  expect(await taskAvailability(vi.fn().mockRejectedValue(new Error("offline")))).toBe(
    "unavailable",
  );
  expect(
    await taskAvailability(vi.fn().mockResolvedValue(new Response("error", { status: 503 }))),
  ).toBe("unavailable");
});
it("checks vendor availability before trial favorites can be saved", async () => {
  const request = vi.fn().mockResolvedValue(new Response('{"status":"disabled"}'));
  expect(await vendorAvailability(request)).toBe("disabled");
  expect(request).toHaveBeenCalledWith(
    "/api/workspace/feature-status/vendors",
    expect.objectContaining({ cache: "no-store" }),
  );
});

it("checks the selected planning feature without caching", async () => {
  const request = vi.fn().mockResolvedValue(new Response('{"status":"maintenance"}'));
  expect(await planningAvailability("calendar", request)).toBe("maintenance");
  expect(request).toHaveBeenCalledWith(
    "/api/workspace/feature-status/calendar",
    expect.objectContaining({
      cache: "no-store",
      signal: expect.any(AbortSignal),
    }),
  );
});
