import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { isAmbassador, isOperator } from "@/server/identity/policy";
import { AmbassadorScreen } from "@/features/ambassador-operations/components/ambassador-screen";
export const dynamic = "force-dynamic";
export default async function BaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!isAmbassador(session) && !isOperator(session)) redirect("/auth/complete");
  return <AmbassadorScreen view="recruitment" />;
}
