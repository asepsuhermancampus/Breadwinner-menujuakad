import { customerNavigation } from "../components/customer-navigation";

export function customerFeatureGroup(pathname: string) {
  return customerNavigation
    .flatMap((group) => group.items)
    .find(
      (item) =>
        item.children?.some((child) => child.href === pathname) ||
        (item.href === "/marketplace" && pathname.startsWith("/marketplace/vendor/")),
    );
}

export function customerNavigationActive(href: string, pathname: string) {
  return pathname === href || customerFeatureGroup(pathname)?.href === href;
}
