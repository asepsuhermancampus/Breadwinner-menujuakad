import { customerNavigation, type CustomerNavigationItem } from "../components/customer-navigation";

const marketplaceFeatureGroup: CustomerNavigationItem = {
  label: "Catatan Vendor Manual",
  href: "/marketplace",
  icon: "notebook",
  children: [
    { label: "Marketplace Vendor", href: "/marketplace" },
    { label: "Vendor pilihan", href: "/marketplace/favorites" },
  ],
};

export function customerFeatureGroup(pathname: string) {
  return customerNavigation
    .flatMap((group) => group.items)
    .concat(marketplaceFeatureGroup)
    .find(
      (item) =>
        item.children?.some((child) => child.href === pathname) ||
        (item.href === "/marketplace" && pathname.startsWith("/marketplace/vendor/")),
    );
}

export function customerNavigationActive(href: string, pathname: string) {
  return pathname === href || customerFeatureGroup(pathname)?.href === href;
}
