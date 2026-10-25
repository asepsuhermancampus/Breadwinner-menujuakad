"use client";
import Link from "next/link";
import {
  useAccountOverview,
  useGuestOverview,
  type OverviewResources,
} from "../hooks/use-overview-resources";
import type { CustomerWorkspace } from "../types";
import type { PlannerTask } from "@/features/planner-tasks/types/tasks";
import { OverviewGreeting } from "@/features/planner-overview/components/overview-greeting";
import { OverviewMetrics } from "@/features/planner-overview/components/overview-metrics";
import { CustomerPriorities } from "./customer-priorities";
import { useCustomerEvent } from "./customer-event-context";
import { getPlan } from "@/features/plans/domain/catalog";
import { SubscriptionReminder } from "./subscription-reminder";
import styles from "./customer-overview.module.css";
export function AccountOverview({ workspace }: { workspace: CustomerWorkspace }) {
  return <CustomerOverview workspace={workspace} resources={useAccountOverview(workspace.id)} />;
}
export function GuestOverview({ workspace }: { workspace: CustomerWorkspace }) {
  return <CustomerOverview workspace={workspace} resources={useGuestOverview()} guest />;
}
function CustomerOverview({
  workspace,
  resources,
  guest = false,
}: {
  workspace: CustomerWorkspace;
  resources: OverviewResources;
  guest?: boolean;
}) {
  const event = useCustomerEvent();
  const allTasks = (resources.tasks.data ?? []) as PlannerTask[];
  const tasks = allTasks.filter((t) => t.event === event);
  const documents = (resources.documents.data ?? []) as { completed?: boolean }[];
  const completed = tasks.filter((t) => t.status === "Selesai").length;
  const readyDocuments = documents.filter((d) => d.completed).length;
  const total = tasks.length + documents.length;
  const readiness =
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
  const name = workspace.profile.fullName
    ? `${workspace.profile.fullName}${workspace.profile.partnerName ? ` & ${workspace.profile.partnerName}` : ""}`
    : "kalian";
  const loading = Object.values(resources).some((r) => r.data === null);
  const error = Object.values(resources).find((r) => r.error)?.error;
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
      />
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      <OverviewMetrics metrics={metrics} />
      <CustomerPriorities
        workspace={workspace}
        tasks={tasks}
        allTasks={allTasks}
        resources={resources}
        loading={loading}
      />
      <section className={styles.quickLinks} aria-label="Langkah perencanaan berikutnya">
        <div>
          <h2>Rundown tak perlu dimulai dari nol.</h2>
          <p>Susun agenda dan pembagian tugas untuk hari istimewa kalian.</p>
        </div>
        <Link href="/planner/rundown">Buat draft rundown</Link>
        <Link href="/planner/wedding-kit">Wedding Kit</Link>
      </section>
      <footer className={styles.activity}>
        <span>
          {guest
            ? "Perubahan percobaan tersimpan di browser ini."
            : "Rencana kalian tersimpan di ruang bersama."}
        </span>
        <Link href="/planner/tasks">+ Tugas / pengeluaran</Link>
      </footer>
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
