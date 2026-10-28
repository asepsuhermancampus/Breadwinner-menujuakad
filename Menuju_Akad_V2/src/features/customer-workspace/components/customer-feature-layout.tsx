"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PageHeading } from "@/components/ui/page-heading";
import { PageHeadingLevel } from "@/components/ui/page-heading-level";
import { customerFeatureGroup } from "../domain/feature-groups";
import { CustomerFeatureTabs } from "./customer-feature-tabs";
import styles from "./customer-feature-tabs.module.css";

const descriptions: Record<string, string> = {
  "/planner/rundown":
    "Susun alur acara, jadwal koordinasi, dan perlengkapan darurat dalam satu tempat.",
  "/planner/seserahan": "Catat kebutuhan seserahan dan kumpulkan inspirasi untuk hari kalian.",
  "/marketplace": "Temukan vendor dan kelola pilihan kalian melalui tab di bawah.",
  "/marketplace/bundles":
    "Susun vendor pilihan dan kirim kebutuhan acara untuk mendapatkan penawaran.",
  "/planner/invitations": "Kelola undangan kalian dan sesuaikan tampilannya melalui studio visual.",
};

export function CustomerFeatureLayout({ children }: { children: ReactNode }) {
  const group = customerFeatureGroup(usePathname());
  if (!group) return <>{children}</>;
  return (
    <section className={styles.featureLayout}>
      <header className={styles.heading} data-feature-heading>
        <PageHeading
          title={group.label}
          description={descriptions[group.href] ?? "Kelola fitur melalui tab di bawah."}
        />
      </header>
      <CustomerFeatureTabs />
      <PageHeadingLevel value={2}>{children}</PageHeadingLevel>
    </section>
  );
}
