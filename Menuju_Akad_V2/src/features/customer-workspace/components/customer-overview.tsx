"use client";
import Link from "next/link";
import type { OverviewResources } from "../hooks/use-overview-resources";
import type { CustomerWorkspace } from "../types";
import type { PlannerTask } from "@/features/planner-tasks/types/tasks";
import { OverviewGreeting } from "@/features/planner-overview/components/overview-greeting";
import { OverviewMetrics } from "@/features/planner-overview/components/overview-metrics";
import { CustomerPriorities } from "./customer-priorities";
import { useCustomerEvent } from "./customer-event-context";
import { getPlan } from "@/features/plans/domain/catalog";
import { SubscriptionReminder } from "./subscription-reminder";
import styles from "./customer-overview.module.css";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { orderedCoupleNames } from "../domain/profile-names";
import type { DashboardCard } from "../domain/dashboard-card-catalog";
export type OverviewProps = {
  workspace: CustomerWorkspace;
  visibleCards: DashboardCard[];
  tasksAvailable: boolean;
  calendarAvailable: boolean;
  documentsAvailable: boolean;
  rundownAvailable: boolean;
  pdfAvailable: boolean;
  guestsAvailable: boolean;
  financeAvailable: boolean;
};
export function CustomerOverview({
  workspace,
  resources,
  guest = false,
  visibleCards,
  tasksAvailable,
  calendarAvailable,
  documentsAvailable,
  rundownAvailable,
  pdfAvailable,
  guestsAvailable,
  financeAvailable,
}: {
  workspace: CustomerWorkspace;
  resources: OverviewResources;
  guest?: boolean;
  visibleCards: DashboardCard[];
  tasksAvailable: boolean;
  calendarAvailable: boolean;
  documentsAvailable: boolean;
  rundownAvailable: boolean;
  pdfAvailable: boolean;
  guestsAvailable: boolean;
  financeAvailable: boolean;
}) {
  const event = useCustomerEvent();
  const allTasks = (resources.tasks.data ?? []) as PlannerTask[];
  const tasks = allTasks.filter((t) => t.event === event);
  const documents = (
    (resources.documents.data ?? []) as { completed?: boolean; archived?: boolean }[]
  ).filter((item) => !item.archived);
  const completed = tasks.filter((t) => t.status === "Selesai").length;
  const readyDocuments = documents.filter((d) => d.completed).length;
  const total = tasks.length + documents.length;
  const readiness =
    !tasksAvailable ||
    !documentsAvailable ||
    resources.tasks.data === null ||
    resources.documents.data === null ||
    resources.tasks.error ||
    resources.documents.error
      ? null
      : total
        ? Math.round(((completed + readyDocuments) / total) * 100)
        : 0;
  const amount = (resources.finance.data ?? []).reduce<number>(
    (sum, row) => sum + ((row as { amount?: number }).amount ?? 0),
    0,
  );
  const name = orderedCoupleNames(workspace.profile, workspace.ownerSide).join(" & ") || "kalian";
  const loading = Object.values(resources).some((r) => r.data === null);
  const error = Object.values(resources).find((r) => r.error)?.error;
  if (loading && !error) return <PageSkeleton variant="cards" label="Memuat ringkasan kalian" />;
  const metrics = [
    {
      id: "tasks",
      label: "Checklist tugas",
      value: loading ? "—" : `${completed}/${tasks.length}`,
      detail: `${tasks.length - completed} tugas perlu diselesaikan`,
      isMono: true,
    },
    {
      id: "documents",
      label: "Dokumen KUA",
      value: loading ? "—" : `${readyDocuments}/${documents.length}`,
      detail: "Kesiapan berkas pernikahan kalian",
      isMono: true,
    },
    {
      id: "budget",
      label: "Anggaran acara",
      value: loading ? "—" : `Rp ${amount.toLocaleString("id-ID")}`,
      detail: "Total anggaran yang sudah dicatat",
      isMono: true,
    },
    {
      id: "guests",
      label: "Daftar tamu",
      value: loading ? "—" : String(resources.guests.data?.length ?? 0),
      detail: "Tamu yang sudah kalian daftarkan",
      isMono: true,
    },
  ];
  const visible = new Set<string>(visibleCards);
  const visibleMetrics = metrics.filter(
    (metric) =>
      visible.has(metric.id) &&
      (tasksAvailable || metric.id !== "tasks") &&
      (documentsAvailable || metric.id !== "documents") &&
      (guestsAvailable || metric.id !== "guests") &&
      (financeAvailable || metric.id !== "budget"),
  );
  return (
    <div className={styles.overview}>
      <OverviewGreeting
        dateContext={new Date().toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Jakarta",
        })}
        greeting={`Selamat datang, ${name}.`}
        countdownLabel={event === "wedding" ? "Akad & Resepsi" : "Mode Lamaran"}
        eventDetail={`Paket ${getPlan(workspace.subscription.planId).label}`}
        readinessPercent={readiness}
        readinessLabel="Checklist & berkas siap"
        tasksAvailable={tasksAvailable}
      />
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      {visibleMetrics.length > 0 && <OverviewMetrics metrics={visibleMetrics} />}
      {visible.has("priorities") && (
        <CustomerPriorities
          tasksAvailable={tasksAvailable}
          calendarAvailable={calendarAvailable}
          workspace={workspace}
          tasks={tasks}
          allTasks={allTasks}
          resources={resources}
          loading={loading}
        />
      )}
      {visible.has("quick-links") && (
        <section className={styles.quickLinks} aria-label="Langkah perencanaan berikutnya">
          <div>
            <h2>Susun acara bersama.</h2>
            <p>Susun agenda dan pembagian tugas untuk hari istimewa kalian.</p>
          </div>
          {rundownAvailable && <Link href="/planner/rundown">Buka rundown</Link>}
          {pdfAvailable && <Link href="/planner/wedding-kit">Ringkasan untuk dibagikan</Link>}
        </section>
      )}
      {tasksAvailable && (
        <footer className={styles.activity}>
          <Link href="/planner/tasks">Lihat tugas</Link>
        </footer>
      )}
      {!guest && !workspace.profile.fullName && (
        <p className="text-xs text-secondary">
          Kalian sudah dapat memakai fitur paket.{" "}
          <Link href="/account" className="underline">
            Lengkapi profil
          </Link>{" "}
          kapan saja.
        </p>
      )}
      {workspace.role === "owner" && workspace.subscription.planId === "premium" && (
        <SubscriptionReminder expiresAt={workspace.subscription.expiresAt} />
      )}
    </div>
  );
}
