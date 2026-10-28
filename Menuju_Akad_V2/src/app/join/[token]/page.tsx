import { notFound, redirect } from "next/navigation";
import { dashboardContext } from "@/app/_components/dashboard-context";
import { JoinWorkspace } from "@/features/customer-workspace/components/join-workspace";
export const dynamic = "force-dynamic";
export default async function JoinPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[a-f0-9]{64}$/.test(token)) notFound();
  const access = await dashboardContext();
  if (access.mode === "guest") redirect("/login?returnTo=" + encodeURIComponent("/join/" + token));
  return <JoinWorkspace token={token} />;
}
