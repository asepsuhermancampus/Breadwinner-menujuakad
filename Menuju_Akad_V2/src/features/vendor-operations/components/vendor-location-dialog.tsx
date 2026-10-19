import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import type { VendorProfile } from "../types/vendor";
export function VendorLocationDialog({
  profile,
  canEdit,
  profileChange,
  onClose,
}: {
  profile: VendorProfile;
  canEdit: boolean;
  profileChange: (patch: Partial<VendorProfile>) => void;
  onClose: () => void;
}) {
  return (
    <Dialog open title="Titik usaha" onClose={() => onClose()}>
      <div className="grid gap-5">
        <Field
          label="Alamat usaha"
          value={profile.address}
          disabled={!canEdit}
          onChange={(e) => profileChange({ address: e.target.value })}
        />
        <p className="text-sm text-secondary">
          Lokasi {profile.city}. Tidak ada permintaan geolocation otomatis.
        </p>
        <label className="flex min-h-11 items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={profile.pinSet}
            disabled={!canEdit}
            onChange={(e) => profileChange({ pinSet: e.target.checked })}
          />
          Pin usaha sudah ditinjau
        </label>
        <Button onClick={() => onClose()}>Kembali ke katalog</Button>
      </div>
    </Dialog>
  );
}
