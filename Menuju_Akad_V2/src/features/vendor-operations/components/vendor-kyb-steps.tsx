import { Icon } from "@/components/ui/icon";

export function VendorKybSteps({ pending }: { pending: boolean }) {
  return (
    <ol
      aria-label="Langkah verifikasi usaha"
      className="grid grid-cols-2 gap-3 rounded-card border border-border bg-surface p-4 sm:grid-cols-4"
    >
      {["Dokumen", "Identitas", "Rekening", "Lokasi"].map((label, index) => (
        <li
          key={label}
          aria-current={index === 2 ? "step" : undefined}
          className={`flex items-center gap-2 rounded-control px-3 py-2 text-xs ${index === 2 ? "bg-subtle font-semibold text-warning" : "text-secondary"}`}
        >
          <span className="font-mono">0{index + 1}</span>
          {label}
          {index === 2 ? (
            <span className="ml-auto">{pending ? "ditinjau" : "revisi"}</span>
          ) : (
            <Icon name="check" size={14} className="ml-auto text-success" />
          )}
        </li>
      ))}
    </ol>
  );
}
