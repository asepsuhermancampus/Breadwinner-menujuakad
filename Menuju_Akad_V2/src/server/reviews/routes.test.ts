import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { openReviewDatabase } from "./database";
import { ReviewRepository } from "./repository";
import type { Session } from "next-auth";
import { provisionAccount } from "./accounts";
import { SESSION_COOKIE } from "./sessions";
import { createVisitorToken, VISITOR_COOKIE } from "./visitor";
import { GET as publicGet, POST as submit } from "@/app/api/reviews/route";
import { POST as login } from "@/app/api/superadmin/login/route";
import { POST as logout } from "@/app/api/superadmin/logout/route";
import { GET as inbox } from "@/app/api/superadmin/reviews/route";
import { PATCH as moderate } from "@/app/api/superadmin/reviews/[id]/route";
vi.mock("server-only", () => ({}));
const state = vi.hoisted(() => ({
  repository: undefined as ReviewRepository | undefined,
  session: null as Session | null,
}));
vi.mock("@/server/auth", () => ({ auth: async () => state.session }));
vi.mock("./runtime", () => ({ getReviewRepository: () => state.repository! }));
let visitor = "";
beforeEach(() => {
  state.session = null;
  state.repository = new ReviewRepository(openReviewDatabase(":memory:"));
  provisionAccount(state.repository.db, "admin@example.test", "TestingReview!2026");
  visitor = createVisitorToken(state.repository.db);
});
afterEach(() => state.repository?.db.close());
function request(
  url: string,
  method = "GET",
  data?: unknown,
  cookie = "",
  origin = "http://localhost:3200",
) {
  return new Request(`http://localhost:3200${url}`, {
    method,
    headers: {
      origin,
      "content-type": "application/json",
      cookie: `${VISITOR_COOKIE}=${visitor}; ${cookie}`,
    },
    ...(data === undefined ? {} : { body: JSON.stringify(data) }),
  });
}
async function authenticatedCookie() {
  const admin = state.repository!.db.prepare("SELECT id,email FROM review_admins").get()!;
  state.session = {
    user: { id: String(admin.id), email: String(admin.email), role: "superadmin" },
    expires: new Date(Date.now() + 60000).toISOString(),
  };
  return "";
}
const input = { name: "Laras", rating: 1, comment: "Daftar tamu sulit ditemukan di HP saya." };

it("keeps submission private until superadmin publication and removes it on hiding", async () => {
  const sent = await submit(request("/api/reviews", "POST", input));
  expect(sent.status).toBe(201);
  expect((await (await publicGet(request("/api/reviews"))).json()).total).toBe(0);
  expect((await inbox(request("/api/superadmin/reviews"))).status).toBe(401);
  const cookie = await authenticatedCookie();
  const list = await (
    await inbox(request("/api/superadmin/reviews", "GET", undefined, cookie))
  ).json();
  expect(list.items[0].rating).toBe(1);
  const id = list.items[0].id;
  for (const status of ["published", "hidden"]) {
    const response = await moderate(
      request(`/api/superadmin/reviews/${id}`, "PATCH", { status }, cookie),
      { params: Promise.resolve({ id }) },
    );
    expect(response.status).toBe(200);
    const publicList = await (await publicGet(request("/api/reviews"))).json();
    expect(publicList.total).toBe(status === "published" ? 1 : 0);
    expect(JSON.stringify(publicList)).not.toContain("moderatedBy");
  }
  expect((await logout(request("/api/superadmin/logout", "POST", {}, cookie))).status).toBe(410);
  state.session = null;
  expect((await inbox(request("/api/superadmin/reviews", "GET", undefined, cookie))).status).toBe(
    401,
  );
});
it("denies fabricated role cookies, wrong credentials and cross-origin writes", async () => {
  const cookie = `${SESSION_COOKIE}=superadmin; role=superadmin`;
  expect((await inbox(request("/api/superadmin/reviews", "GET", undefined, cookie))).status).toBe(
    401,
  );
  expect(
    (
      await moderate(
        request("/api/superadmin/reviews/x", "PATCH", { status: "published" }, cookie),
        { params: Promise.resolve({ id: "x" }) },
      )
    ).status,
  ).toBe(401);
  expect(
    (
      await login(
        request("/api/superadmin/login", "POST", {
          email: "admin@example.test",
          password: "wrong",
        }),
      )
    ).status,
  ).toBe(410);
  expect(
    (await submit(request("/api/reviews", "POST", input, "", "https://evil.test"))).status,
  ).toBe(403);
  expect(state.repository!.list({ page: 1 }).total).toBe(0);
});
it("keeps review inbox private from customer and admin roles", async () => {
  for (const role of ["customer", "admin"] as const) {
    state.session = {
      user: { id: "other-account", email: `${role}@example.test`, role },
      expires: new Date(Date.now() + 60000).toISOString(),
    };
    expect((await inbox(request("/api/superadmin/reviews"))).status).toBe(401);
    expect(
      (
        await moderate(request("/api/superadmin/reviews/test", "PATCH", { status: "published" }), {
          params: Promise.resolve({ id: "test" }),
        })
      ).status,
    ).toBe(401);
  }
});
it("limits submissions and rejects invalid input and oversized bodies", async () => {
  expect((await submit(request("/api/reviews", "POST", { ...input, rating: 8 }))).status).toBe(400);
  expect(
    (await submit(request("/api/reviews", "POST", { ...input, comment: "x".repeat(17000) })))
      .status,
  ).toBe(413);
  state.repository!.db.exec("DELETE FROM review_limits");
  for (let index = 0; index < 5; index++)
    expect((await submit(request("/api/reviews", "POST", input))).status).toBe(201);
  expect((await submit(request("/api/reviews", "POST", input))).status).toBe(429);
  expect(state.repository!.list({ page: 1 }).total).toBe(5);
});
