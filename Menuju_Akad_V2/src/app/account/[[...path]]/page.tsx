import { notFound, redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { dashboardContext } from "@/app/_components/dashboard-context";
import { CustomerShell } from "@/features/customer-workspace/components/customer-shell";
import { CustomerAccount } from "@/features/customer-workspace/components/customer-account";
import { isOperator } from "@/server/identity/policy";
import { isAccountTab } from "@/features/customer-workspace/config/account-tabs";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { readFeatureAvailability } from "@/server/workspaces/feature-availability";

export const dynamic = "force-dynamic";

export default async function AccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<{ section?: string | string[] }>;
}) {
  const session = await auth();
  if (session?.user?.role === "superadmin") redirect("/superadmin/security");
  if (session?.user?.role === "admin") redirect("/admin/security");

  const [{ path }, { section }] = await Promise.all([params, searchParams]);
  if (!path?.length && (section === "domain" || section === "support")) {
    redirect(section === "domain" ? "/account/domain" : "/account/support");
  }
  const tab = path?.join("/") || "profile";
  if (!isAccountTab(tab)) notFound();
  const access = await dashboardContext();
  const audience = access.mode === "guest" ? "guest" : access.workspace.role;
  const unavailable =
    (tab === "support" || tab === "domain") &&
    !readFeatureAvailability(
      getWorkspaceService().db,
      tab,
      audience,
      access.mode === "guest" ? null : access.workspace,
    ).available;

  return (
    <CustomerShell access={access} initialFeatureUnavailable={unavailable}>
      {unavailable ? (
        <p role="status">
          {tab === "domain" ? "Custom domain" : "Bantuan"} belum tersedia untuk kelompok ini.
        </p>
      ) : access.mode === "account" ? (
        <CustomerAccount
          key={access.workspace.id}
          workspace={access.workspace}
          tab={tab}
          operator={isOperator(session)}
        />
      ) : (
        <CustomerAccount workspace={access.workspace} tab={tab} guest />
      )}
    </CustomerShell>
  );
}
