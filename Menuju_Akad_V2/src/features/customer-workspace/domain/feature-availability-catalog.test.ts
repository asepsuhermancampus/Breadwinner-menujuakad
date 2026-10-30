import { expect, it } from "vitest";
import {
  isAvailableFeaturePath,
  availableNavigationDestination,
} from "./feature-availability-catalog";

it("hides only the routes for features unavailable to the current audience", () => {
  const availability = {
    tasks: false,
    emergency: true,
    calendar: false,
    moodboard: false,
    documents: false,
    rundown: false,
    guests: false,
    finance: false,
    support: false,
    vendors: false,
    domain: false,
    seserahan: false,
    catering: false,
    pdf: false,
    invitations: false,
    "studio-drafts": false,
  };
  expect(isAvailableFeaturePath("/planner/tasks", availability)).toBe(false);
  expect(isAvailableFeaturePath("/planner/calendar", availability)).toBe(false);
  expect(isAvailableFeaturePath("/planner/emergency", availability)).toBe(true);
  expect(isAvailableFeaturePath("/planner/moodboard", availability)).toBe(false);
  expect(isAvailableFeaturePath("/planner/kua", availability)).toBe(false);
  expect(isAvailableFeaturePath("/planner/rundown", availability)).toBe(false);
  expect(isAvailableFeaturePath("/planner/guests", availability)).toBe(false);
  expect(isAvailableFeaturePath("/checkin", availability)).toBe(false);
  expect(isAvailableFeaturePath("/planner/finance", availability)).toBe(false);
  expect(isAvailableFeaturePath("/account/support", availability)).toBe(false);
  expect(isAvailableFeaturePath("/account/domain", availability)).toBe(false);
  expect(isAvailableFeaturePath("/marketplace/vendor/example", availability)).toBe(false);
  expect(isAvailableFeaturePath("/checkout/services", availability)).toBe(false);
  expect(isAvailableFeaturePath("/planner/seserahan", availability)).toBe(false);
  expect(isAvailableFeaturePath("/planner/wedding-kit", availability)).toBe(false);
  expect(isAvailableFeaturePath("/planner/invitations", availability)).toBe(false);
  expect(isAvailableFeaturePath("/planner/invitations/studio", availability)).toBe(false);
  expect(isAvailableFeaturePath("/dashboard", availability)).toBe(true);
});
it("keeps a navigation group reachable through an available child when its primary feature is disabled", () => {
  const available = {
    tasks: true,
    emergency: true,
    calendar: true,
    moodboard: true,
    documents: true,
    rundown: false,
    guests: true,
    finance: true,
    support: true,
    vendors: true,
    domain: true,
    seserahan: true,
    catering: true,
    pdf: true,
    invitations: true,
    "studio-drafts": true,
  };
  const group = {
    href: "/planner/rundown",
    children: [
      { href: "/planner/rundown" },
      { href: "/planner/calendar" },
      { href: "/planner/emergency" },
    ],
  };
  expect(availableNavigationDestination(group, available)).toBe("/planner/calendar");
  expect(availableNavigationDestination(group, { ...available, calendar: false })).toBe(
    "/planner/emergency",
  );
  expect(
    availableNavigationDestination(group, { ...available, calendar: false, emergency: false }),
  ).toBeNull();
});
