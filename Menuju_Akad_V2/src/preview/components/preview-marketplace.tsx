"use client";

import { WorkspaceShell } from "@/features/shell-navigation/components/workspace-shell";
import { MarketplaceScreen } from "@/features/marketplace/components/marketplace-screen";
import { VendorDetailScreen } from "@/features/marketplace/components/vendor-detail-screen";
import { FavoritesScreen } from "@/features/marketplace/components/favorites-screen";
import { BundlerScreen } from "@/features/marketplace/components/bundler-screen";
import { PreviewNotice } from "./preview-notice";
import { initialMarketplaceVendorsFixture } from "../fixtures/marketplace";
import { accountFixture } from "../fixtures/account";

function ShellWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PreviewNotice />
      <WorkspaceShell
        name={accountFixture.profile.fullName}
        memberships={accountFixture.memberships}
      >
        {children}
      </WorkspaceShell>
    </>
  );
}

export function PreviewMarketplace() {
  return (
    <ShellWrapper>
      <MarketplaceScreen initialVendors={initialMarketplaceVendorsFixture} />
    </ShellWrapper>
  );
}

export function PreviewVendorDetail({ vendorSlug: _vendorSlug }: { vendorSlug?: string } = {}) {
  return (
    <ShellWrapper>
      <VendorDetailScreen />
    </ShellWrapper>
  );
}

export function PreviewFavorites() {
  return (
    <ShellWrapper>
      <FavoritesScreen />
    </ShellWrapper>
  );
}

export function PreviewBundler() {
  return (
    <ShellWrapper>
      <BundlerScreen />
    </ShellWrapper>
  );
}
