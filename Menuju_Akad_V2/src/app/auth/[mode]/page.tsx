import { notFound, redirect } from "next/navigation";
import { safeReturnTo } from "@/features/auth/lib/return-to";
import { CustomerAuth } from "@/features/auth/components/customer-auth";
export const dynamic = "force-dynamic";
export default async function AuthPage({
  params,
  searchParams,
}: {
  params: Promise<{ mode: string }>;
  searchParams: Promise<{ returnTo?: string; error?: string }>;
}) {
  const { mode } = await params;
  if (mode !== "login" && mode !== "register" && mode !== "recovery") notFound();
  if (mode === "login") {
    const query = await searchParams;
    const destination = new URLSearchParams();
    if (query.returnTo) destination.set("returnTo", safeReturnTo(query.returnTo));
    if (query.error && query.error.length <= 80) destination.set("error", query.error);
    redirect(`/login${destination.size ? `?${destination}` : ""}`);
  }
  const query = await searchParams;
  return <CustomerAuth mode={mode} initialReturnTo={safeReturnTo(query.returnTo ?? null)} />;
}
