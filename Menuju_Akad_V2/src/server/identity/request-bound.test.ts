import { expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const state = vi.hoisted(() => ({ post: vi.fn(async () => new Response("ok")) }));
vi.mock("server-only", () => ({}));
vi.mock("@/server/auth", () => ({ handlers: { POST: state.post, GET: vi.fn() } }));
vi.mock("@/server/payments/http", () => ({ validateSameOrigin: () => null }));
import { POST } from "@/app/api/auth/[...nextauth]/route";
it("rejects oversized streaming auth requests without Content-Length before Auth.js buffers them", async () => {
  state.post.mockClear();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(17000));
      controller.close();
    },
  });
  const options = { method: "POST", body: stream, duplex: "half" } as ConstructorParameters<
    typeof NextRequest
  >[1];
  const response = await POST(
    new NextRequest("http://localhost/api/auth/callback/credentials", options),
  );
  expect(response.status).toBe(413);
  expect(state.post).not.toHaveBeenCalled();
});
it("preserves the bounded form body and cookies for Auth.js", async () => {
  state.post.mockClear();
  const response = await POST(
    new NextRequest("http://localhost/api/auth/callback/credentials", {
      method: "POST",
      headers: { Cookie: "visitor=opaque", "Content-Type": "application/x-www-form-urlencoded" },
      body: "email=user%40example.test",
    }),
  );
  expect(response.status).toBe(200);
  const passed = state.post.mock.calls[0] as unknown as [NextRequest];
  expect(await passed[0].text()).toContain("user%40example.test");
  expect(passed[0].headers.get("cookie")).toBe("visitor=opaque");
});
