import { expect, it } from "vitest";
import { trialReport } from "./trial-export";
it("prints actual resource content safely without invitation credentials", () => {
  const html = trialReport({
    version: 2,
    revision: 1,
    used: {},
    resources: {
      guests: [
        {
          id: "private-id",
          name: "<script>alert(1)</script>",
          personalToken: "secret-invitation-token",
          waConsent: true,
        },
      ],
      tasks: [{ title: "Tugas milik pengguna" }],
    },
  });
  expect(html).toContain("Tugas milik pengguna");
  expect(html).toContain("&lt;script&gt;");
  expect(html).not.toContain("<script>");
  expect(html).not.toContain("secret-invitation-token");
  expect(html).not.toContain("private-id");
});
