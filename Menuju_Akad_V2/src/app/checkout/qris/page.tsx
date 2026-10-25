import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { getPaymentEnvironment, isPaymentReady } from "@/server/payments/runtime";
import { QrisCheckout } from "@/features/payments/components/qris-checkout";
import { PlanCheckout } from "@/features/payments/components/plan-checkout";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function QrisCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { intent } = await searchParams;
  const validIntent = intent && /^[a-f0-9-]{36}$/.test(intent) ? intent : null;
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(`/checkout/qris${validIntent ? `?intent=${validIntent}` : ""}`)}`,
    );
  }

  const isReady = isPaymentReady();
  const environment = isReady ? getPaymentEnvironment() : null;

  if (validIntent)
    return (
      <main className="mx-auto max-w-xl px-4 py-8">
        <PlanCheckout intentId={validIntent} />
      </main>
    );

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <QrisCheckout
        userEmail={email}
        userName={session.user?.name ?? null}
        environment={environment}
        isReady={isReady}
      />
    </main>
  );
}
