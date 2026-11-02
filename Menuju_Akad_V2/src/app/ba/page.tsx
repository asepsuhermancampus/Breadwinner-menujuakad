import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { isAmbassador, isOperator } from "@/server/identity/policy";
import {
  AmbassadorScreen,
  type AmbassadorView,
} from "@/features/ambassador-operations/components/ambassador-screen";
import { AmbassadorShell } from "@/features/ambassador-operations/components/ambassador-shell";

export const dynamic = "force-dynamic";

export default async function BaPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!isAmbassador(session) && !isOperator(session)) redirect("/auth/complete");

  const params = await searchParams;
  const initialView =
    params?.tab === "ledger" || params?.tab === "withdrawal" ? params.tab : "recruitment";

  return (
    <AmbassadorShell email={session.user.email ?? ""}>
      <AmbassadorScreen view={initialView as AmbassadorView} />
    </AmbassadorShell>
  );
}
