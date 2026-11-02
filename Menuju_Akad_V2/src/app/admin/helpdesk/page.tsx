import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { isOperator } from "@/server/identity/policy";
import { SupportQueue } from "@/features/customer-workspace/components/support-queue";
import { LiveOperationsShell } from "@/features/operations-shell/components/live-operations-shell";

export const dynamic = "force-dynamic";

export default async function HelpdeskPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!isOperator(session)) redirect("/auth/complete");

  return (
    <LiveOperationsShell
      account={session.user.email ?? "Admin"}
      superadmin={session.user.role === "superadmin"}
      active="/admin/helpdesk"
    >
      <div className="space-y-6">
        <header className="rounded-card border border-ux-border bg-surface p-5 sm:p-6 shadow-xs">
          <span className="inline-block rounded-full bg-subtle px-3 py-1 font-mono text-xs font-semibold text-brand-secondary">
            LAYANAN BANTUAN
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Notifikasi & Helpdesk
          </h1>
          <p className="mt-1 text-xs text-secondary sm:text-sm">
            Pantau dan tindak lanjuti tiket pertanyaan serta kendala yang dikirim oleh pelanggan.
          </p>
        </header>

        <SupportQueue />
      </div>
    </LiveOperationsShell>
  );
}

