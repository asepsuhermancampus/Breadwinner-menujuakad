import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { isVendor, isOperator } from "@/server/identity/policy";
import { VendorWorkspaceScreen } from "@/features/vendor-operations/components/vendor-workspace-screen";
export const dynamic = "force-dynamic";
export default async function VendorPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!isVendor(session) && !isOperator(session)) redirect("/auth/complete");
  return <VendorWorkspaceScreen />;
}
