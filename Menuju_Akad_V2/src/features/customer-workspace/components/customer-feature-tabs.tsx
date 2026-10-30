"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { customerFeatureGroup } from "../domain/feature-groups";
import {
  isAvailableFeaturePath,
  defaultFeatureAvailability,
  type FeatureAvailability,
} from "../domain/feature-availability-catalog";
import styles from "./customer-feature-tabs.module.css";

export function CustomerFeatureTabs({
  availability = defaultFeatureAvailability(true),
}: {
  availability?: FeatureAvailability;
}) {
  const pathname = usePathname();
  const group = customerFeatureGroup(pathname);
  if (!group?.children) return null;
  return (
    <nav
      className={`${styles.tabs} app-scroll`}
      aria-label={`Bagian ${group.label}`}
      data-feature-tabs={group.href}
      data-customer-tabs
    >
      {group.children
        .filter((item) => isAvailableFeaturePath(item.href, availability))
        .map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={
              pathname === item.href ||
              (item.href === "/marketplace" && pathname.startsWith("/marketplace/vendor/"))
                ? "page"
                : undefined
            }
          >
            {item.label}
          </Link>
        ))}
    </nav>
  );
}
