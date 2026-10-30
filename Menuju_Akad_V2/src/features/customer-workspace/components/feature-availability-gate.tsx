"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { PageHeading } from "@/components/ui/page-heading";
import {
  availabilityFeatureForPath,
  availabilityFeatures,
} from "../domain/feature-availability-catalog";
import { useFeatureAvailability } from "./feature-availability-context";

export function FeatureAvailabilityGate({
  children,
  initiallyUnavailable = false,
}: {
  children: ReactNode;
  initiallyUnavailable?: boolean;
}) {
  const feature = availabilityFeatureForPath(usePathname());
  const availability = useFeatureAvailability();
  if (!feature || availability === null) return <>{children}</>;
  const unavailable = !availability[feature];
  const refreshNeeded = initiallyUnavailable && !unavailable;
  const StatusContainer = feature === "studio-drafts" ? "main" : "section";
  return (
    <>
      {(unavailable || refreshNeeded) && (
        <StatusContainer
          {...(feature === "studio-drafts" ? { id: "main-content" } : {})}
          className="space-y-3 rounded-card border border-ux-border bg-surface p-6"
          role="status"
        >
          <PageHeading
            title={`${availabilityFeatures[feature]} ${unavailable ? "belum tersedia" : "sudah tersedia"}`}
            description={
              unavailable
                ? "Data yang sudah ada tetap tersimpan. Isian yang belum disimpan tetap ada selama halaman ini terbuka."
                : "Muat ulang halaman untuk menggunakan fitur ini."
            }
          />
          {refreshNeeded && (
            <button className="underline" onClick={() => window.location.reload()}>
              Muat ulang halaman
            </button>
          )}
          {feature === "studio-drafts" && (
            <Link
              className="inline-block underline"
              href={availability.invitations ? "/planner/invitations" : "/dashboard"}
            >
              {availability.invitations ? "Kembali ke undangan" : "Kembali ke ringkasan"}
            </Link>
          )}
        </StatusContainer>
      )}
      <div hidden={unavailable || refreshNeeded} inert={unavailable || refreshNeeded}>
        {children}
      </div>
    </>
  );
}
