import { Icon } from "@/components/ui/icon";

const benefits = [
  ["check-square", "Bagi tanggung jawab", "Checklist, dokumen, dan jadwal yang selalu sama."],
  ["wallet", "Transparan soal dana", "Catat tabungan dan pengeluaran tanpa saling menebak."],
  ["lock-key", "Tetap pribadi", "Hanya anggota ruang kalian yang memiliki akses."],
] as const;

export function PartnerBenefits() {
  return (
    <aside className="space-y-6 px-4 py-6">
      <h2 className="text-2xl leading-snug font-semibold tracking-[-0.6px]">
        Lebih mudah,
        <br />
        kalau bersama.
      </h2>
      {benefits.map(([icon, title, description]) => (
        <div key={title} className="space-y-2">
          <Icon name={icon} size={22} className="text-primary" />
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-[13px] leading-7 text-secondary">{description}</p>
        </div>
      ))}
    </aside>
  );
}
