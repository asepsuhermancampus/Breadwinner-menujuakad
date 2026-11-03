import { describe, expect, it } from "vitest";
import { shouldDismissSliceFocus } from "./use-donut-focus";

describe("shouldDismissSliceFocus", () => {
  it("returns false if no slice is active", () => {
    expect(shouldDismissSliceFocus(null, null)).toBe(false);
  });

  it("returns false if clicking the active slice element", () => {
    const mockElement = {
      closest: (sel: string) => (sel === '[data-slice-id="paid"]' ? {} : null),
    } as unknown as Element;

    expect(shouldDismissSliceFocus(mockElement, "paid")).toBe(false);
  });

  it("returns true if clicking an empty area or background element", () => {
    const emptyElement = {
      closest: () => null,
    } as unknown as Element;

    expect(shouldDismissSliceFocus(emptyElement, "paid")).toBe(true);
    expect(shouldDismissSliceFocus(null, "paid")).toBe(true);
  });

  it("returns true if clicking a different slice element", () => {
    const differentElement = {
      closest: (sel: string) => (sel === '[data-slice-id="dueSoon"]' ? {} : null),
    } as unknown as Element;

    expect(shouldDismissSliceFocus(differentElement, "paid")).toBe(true);
  });
});
