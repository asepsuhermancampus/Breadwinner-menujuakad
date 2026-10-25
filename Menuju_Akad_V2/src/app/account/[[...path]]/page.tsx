import { notFound } from "next/navigation";
import { auth } from "@/server/auth";
import { dashboardContext } from "@/app/_components/dashboard-context";
import { CustomerShell } from "@/features/customer-workspace/components/customer-shell";
import { CustomerAccount } from "@/features/customer-workspace/components/customer-account";
import { isOperator } from "@/server/identity/policy";
export const dynamic = "force-dynamic";
export default async function AccountPage({ params }: { params: Promise<{ path?: string[] }> }) {
  const { path } = await params;
  const tab = path?.join("/") || "profile";
  if (tab !== "profile" && tab !== "security" && tab !== "plans") notFound();
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
