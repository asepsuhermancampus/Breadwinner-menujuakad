import { expect, it } from "vitest";
import { parseGuestCsv, newGuestIdentity } from "./customer-import";
it("imports actual quoted CSV fields with unique opaque tokens", () => {
  const rows = parseGuestCsv(
    'nama,telepon,kuota\n"Keluarga, Bahagia",08123456789,2\nTamu berikutnya,,1',
  );
  expect(rows).toHaveLength(2);
  expect(rows[0]).toMatchObject({ name: "Keluarga, Bahagia", quota: 2 });
  expect(rows[0]!.personalToken.length).toBeGreaterThanOrEqual(32);
  expect(rows[0]!.personalToken).not.toBe(rows[1]!.personalToken);
  expect(() => parseGuestCsv("nama,kuota\nTamu,0")).toThrow();
  expect(newGuestIdentity().id).not.toBe(newGuestIdentity().id);
});
