import { notFound, redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { dashboardContext } from "@/app/_components/dashboard-context";
import { CustomerShell } from "@/features/customer-workspace/components/customer-shell";
import { CustomerAccount } from "@/features/customer-workspace/components/customer-account";
import { isOperator } from "@/server/identity/policy";
import { isAccountTab } from "@/features/customer-workspace/config/account-tabs";
export const dynamic = "force-dynamic";
export default async function AccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<{ section?: string | string[] }>;
}) {
  const [{ path }, { section }] = await Promise.all([params, searchParams]);
  if (!path?.length && (section === "domain" || section === "support")) {
    redirect(section === "domain" ? "/account/domain" : "/account/support");
  }
  const tab = path?.join("/") || "profile";
  if (!isAccountTab(tab)) notFound();
  const access = await dashboardContext();
  const session = access.mode === "account" ? await auth() : null;
  return (
    <CustomerShell access={access}>
      {access.mode === "account" ? (
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
