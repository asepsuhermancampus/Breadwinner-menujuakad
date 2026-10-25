import { redirect } from "next/navigation";
import { getSuperadminSession } from "@/server/reviews/access";
import { SuperadminInbox } from "@/features/reviews/components/superadmin-inbox";
export const runtime = "nodejs";
export default async function SuperadminReviewsPage() {
  const account = await getSuperadminSession();
  if (!account) redirect("/superadmin/login");
  return <SuperadminInbox email={account.email} />;
}
