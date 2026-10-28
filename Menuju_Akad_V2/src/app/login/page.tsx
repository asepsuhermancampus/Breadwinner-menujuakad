import { CustomerAuth } from "@/features/auth/components/customer-auth";
import { safeReturnTo } from "@/features/auth/lib/return-to";
export const dynamic = "force-dynamic";
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string; callbackUrl?: string }>;
}) {
  const query = await searchParams;
  return (
    <CustomerAuth
      mode="login"
      initialReturnTo={safeReturnTo(query.returnTo ?? query.callbackUrl ?? null)}
    />
  );
}
