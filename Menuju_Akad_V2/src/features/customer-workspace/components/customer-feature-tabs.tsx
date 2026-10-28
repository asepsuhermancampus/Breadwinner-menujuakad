"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { customerFeatureGroup } from "../domain/feature-groups";
import styles from "./customer-feature-tabs.module.css";

export function CustomerFeatureTabs() {
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
      {group.children.map((item) => (
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
