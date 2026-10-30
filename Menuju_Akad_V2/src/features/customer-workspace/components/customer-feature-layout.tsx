"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PageHeading } from "@/components/ui/page-heading";
import { PageHeadingLevel } from "@/components/ui/page-heading-level";
import { customerFeatureGroup } from "../domain/feature-groups";
import { CustomerFeatureTabs } from "./customer-feature-tabs";
import type { FeatureAvailability } from "../domain/feature-availability-catalog";
import { useFeatureAvailability } from "./feature-availability-context";
import styles from "./customer-feature-tabs.module.css";

const descriptions: Record<string, string> = {
  "/planner/rundown":
    "Susun alur acara, jadwal koordinasi, dan perlengkapan darurat dalam satu tempat.",
  "/marketplace": "Temukan vendor dan kelola pilihan kalian melalui tab di bawah.",
  "/marketplace/bundles":
    "Susun vendor pilihan dan kirim kebutuhan acara untuk mendapatkan penawaran.",
  "/planner/invitations": "Kelola undangan kalian dan sesuaikan tampilannya melalui studio visual.",
};

export function CustomerFeatureLayout({
  children,
  availability,
}: {
  children: ReactNode;
  availability?: FeatureAvailability;
}) {
  const group = customerFeatureGroup(usePathname());
  const latest = useFeatureAvailability();
  const visibleFeatures = latest ?? availability;
  if (!group) return <>{children}</>;
  return (
    <section className={styles.featureLayout}>
      <header className={styles.heading} data-feature-heading>
        <PageHeading
          title={group.label}
          description={descriptions[group.href] ?? "Kelola fitur melalui tab di bawah."}
        />
      </header>
      <CustomerFeatureTabs {...(visibleFeatures ? { availability: visibleFeatures } : {})} />
      <PageHeadingLevel value={2}>{children}</PageHeadingLevel>
    </section>
  );
}
