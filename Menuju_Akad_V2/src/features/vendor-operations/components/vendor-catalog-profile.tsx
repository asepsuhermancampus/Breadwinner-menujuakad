import { Field } from "@/components/ui/field";
import type { VendorProfile } from "../types/vendor";
export function VendorCatalogProfile({
  profile,
  canEdit,
  profileChange,
}: {
  profile: VendorProfile;
  canEdit: boolean;
  profileChange: (patch: Partial<VendorProfile>) => void;
}) {
  return (
    <section className="grid max-w-3xl gap-5" aria-label="Profil usaha">
      <Field
        label="Pemilik usaha"
        value={profile.ownerName}
        disabled={!canEdit}
        onChange={(e) => profileChange({ ownerName: e.target.value })}
      />
      <Field
        label="Kategori usaha"
        value={profile.category}
        disabled={!canEdit}
        onChange={(e) => profileChange({ category: e.target.value })}
      />
      <Field
        label="Alamat usaha"
        value={profile.address}
        disabled={!canEdit}
        onChange={(e) => profileChange({ address: e.target.value })}
      />
      <label className="grid gap-2 text-sm font-medium">
        Deskripsi usaha
        <textarea
          rows={4}
          maxLength={1000}
          disabled={!canEdit}
          className="rounded-control border border-ux-border p-3 text-sm font-normal"
          value={profile.description}
          onChange={(e) => profileChange({ description: e.target.value })}
        />
      </label>
    </section>
  );
}
