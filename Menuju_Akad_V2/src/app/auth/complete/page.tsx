import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { safeReturnTo } from "@/features/auth/lib/return-to";
export const dynamic = "force-dynamic";
export default async function Complete({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role === "superadmin") redirect("/superadmin/reviews");
  if (session.user.role === "admin") redirect("/admin");
  const { returnTo } = await searchParams;
  redirect(returnTo ? safeReturnTo(returnTo) : "/dashboard");
}
