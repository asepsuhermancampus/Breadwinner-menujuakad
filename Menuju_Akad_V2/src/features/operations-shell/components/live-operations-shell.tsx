"use client";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { OperationsNavItem } from "../types/navigation";
import { OperationsShell } from "./operations-shell";

export function LiveOperationsShell({
  children,
  account,
  superadmin = false,
  active,
}: {
  children: ReactNode;
  account: string;
  superadmin?: boolean;
  active?: string;
}) {
  const router = useRouter();
  const items: OperationsNavItem[] = [
    { label: "Ringkasan Bisnis", icon: "monitor", view: "/admin" },
    { label: "Notifikasi & Helpdesk", icon: "mail", view: "/admin#bantuan" },
    { label: "Permintaan Pelanggan", icon: "orders", view: "/admin#permintaan" },
    ...(superadmin
      ? [{ label: "CMS & Konten", icon: "file-text", view: "/superadmin/reviews" }]
      : []),
    { label: "Keamanan Akun", icon: "shield", view: "/account/security" },
  ];
  return (
    <OperationsShell
      live
      roleLabel={superadmin ? "SUPERADMIN" : "ADMIN"}
      identity="Platform Operations"
      description="Akses terbatas · tim internal"
      account={account}
      title="Platform Operations"
      active={active ?? (superadmin ? "/superadmin/reviews" : "/admin")}
      items={items}
      onNavigate={(href) => router.push(href)}
    >
      {children}
    </OperationsShell>
  );
}
