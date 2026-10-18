import { describe, expect, it } from "vitest";
import { followUpGuests } from "../content/followup-content";
import { toggleVisibleSelection } from "./selection";

describe("follow-up selection across filters", () => {
  it("keeps hidden explicit selections when deselecting visible rows", () => {
    const guests = toggleVisibleSelection(followUpGuests, ["fu-1"]);
    expect(guests.filter((guest) => guest.selected).map((guest) => guest.id)).toEqual([
      "fu-2",
      "fu-3",
      "fu-4",
    ]);
  });

  it("adds only visible rows without selecting the whole eligible segment", () => {
    const guests = toggleVisibleSelection(followUpGuests, ["fu-1", "fu-5"]);
    expect(guests.filter((guest) => guest.selected).map((guest) => guest.id)).toEqual([
      "fu-1",
      "fu-2",
      "fu-3",
      "fu-4",
      "fu-5",
    ]);
    expect(guests.find((guest) => guest.id === "fu-6")?.selected).toBe(false);
  });
});
