import type { Capability } from "@/features/plans/domain/capabilities";
export interface GuideTarget {
  title: string;
  description: string;
  href: string;
  targetId: string;
}
const target = (cap: string, title: string, href: string, description: string): GuideTarget => ({
  title,
  href,
  description,
  targetId: `feature-${cap}`,
});
export const guideTargets: Partial<Record<Capability, GuideTarget>> = {
  "unlimited-guests": target(
    "unlimited-guests",
    "Tamu tanpa batas paket",
    "/planner/guests",
    "Tambah dan kelola tamu tanpa batas 100 tamu dari paket Free.",
  ),
  "unlimited-tasks": target(
    "unlimited-tasks",
    "Checklist & tugas",
    "/planner/tasks",
    "Bagi tanggung jawab dan tandai rencana yang sudah selesai.",
  ),
  "premium-templates": target(
    "premium-templates",
    "Template undangan premium",
    "/planner/invitations",
    "Pilih template premium pada pengaturan undangan kalian.",
  ),
  studio: target(
    "studio",
    "Studio visual",
    "/planner/invitations/studio",
    "Atur elemen desain dan simpan draf pada akun kalian.",
  ),
  moodboard: target(
    "moodboard",
    "Moodboard",
    "/planner/moodboard",
    "Kumpulkan inspirasi visual untuk acara kalian.",
  ),
  pdf: target(
    "pdf",
    "Ekspor rencana PDF",
    "/planner/wedding-kit",
    "Buka dokumen rencana, lalu gunakan Cetak dan Simpan sebagai PDF.",
  ),
  "multi-invitation": target(
    "multi-invitation",
    "Multi-undangan",
    "/planner/invitations",
    "Buat undangan tersendiri untuk setiap acara.",
  ),
  "custom-domain": target(
    "custom-domain",
    "Custom domain",
    "/account/domain",
    "Daftarkan domain dan verifikasi DNS; aktivasi memerlukan hosting dan HTTPS yang sesuai.",
  ),
  "priority-support": target(
    "priority-support",
    "Prioritas bantuan",
    "/account/support",
    "Permintaan bantuan kalian masuk antrean prioritas Lifetime.",
  ),
};
