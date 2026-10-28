"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import type { EventPlan } from "../contracts";
import type { FormErrors } from "../utils/onboarding-validation";

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function EventDetails({
  event,
  errors,
  onChange,
}: {
  event: EventPlan;
  errors: FormErrors;
  onChange: (patch: Partial<Omit<EventPlan, "id" | "kind">>) => void;
}) {
  const [addressOpen, setAddressOpen] = useState(false);
  const [dirtyClose, setDirtyClose] = useState(false);
  const [address, setAddress] = useState(event.address);
  const title = event.kind === "engagement" ? "lamaran" : "pernikahan";
  function saveAddress() {
    onChange({ address });
    setDirtyClose(false);
    setAddressOpen(false);
  }
  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          id={`${event.kind}-city`}
          label="Kota acara"
          value={event.city}
          error={errors[`${event.kind}.city`]}
          onChange={(change) => onChange({ city: change.target.value })}
        />
        <Field
          id={`${event.kind}-venue`}
          label="Venue / tempat acara"
          value={event.venue}
          onChange={(change) => onChange({ venue: change.target.value })}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-subtle p-3.5">
        <Icon name="map-trifold" size={24} className="shrink-0 text-brand-secondary" />
        <div className="min-w-0 flex-1 text-xs leading-6">
          <p className="font-medium">{event.venue || "Venue belum ditentukan"}</p>
          <p className="break-words text-secondary">
            {event.address || "Alamat lengkap dapat dilengkapi nanti."}
          </p>
        </div>
        <Button
          variant="ghost"
          className="text-xs text-brand-secondary"
          onClick={() => {
            setAddress(event.address);
            setAddressOpen(true);
          }}
        >
          Ubah alamat ↗
        </Button>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          id={`${event.kind}-budget`}
          type="number"
          inputMode="numeric"
          min="0"
          step="1"
          label={`Target anggaran ${title}`}
          value={Number.isNaN(event.budgetIdr) ? "" : event.budgetIdr}
          className="font-mono"
          hint={Number.isFinite(event.budgetIdr) ? rupiah.format(event.budgetIdr) : ""}
          error={errors[`${event.kind}.budgetIdr`]}
          onChange={(change) => onChange({ budgetIdr: change.target.valueAsNumber })}
        />
        <Field
          id={`${event.kind}-guests`}
          type="number"
          inputMode="numeric"
          min="0"
          step="1"
          label="Estimasi jumlah undangan"
          value={Number.isNaN(event.guestEstimate) ? "" : event.guestEstimate}
          className="font-mono"
          error={errors[`${event.kind}.guestEstimate`]}
          onChange={(change) => onChange({ guestEstimate: change.target.valueAsNumber })}
        />
      </div>
      <Dialog
        open={addressOpen}
        onClose={() => {
          if (address !== event.address) setDirtyClose(true);
          else setAddressOpen(false);
        }}
        title={`Alamat acara ${title}`}
      >
        <div className="space-y-5">
          <Field
            id={`${event.kind}-address`}
            label="Alamat lengkap"
            value={address}
            onChange={(change) => setAddress(change.target.value)}
          />
          <p className="text-sm leading-6 text-secondary">
            Alamat disimpan pada draf acara ini. Layanan peta belum terhubung.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setAddressOpen(false)}>
              Batal
            </Button>
            <Button onClick={saveAddress}>Simpan alamat</Button>
          </div>
        </div>
      </Dialog>
      <Dialog open={dirtyClose} onClose={() => setDirtyClose(false)} title="Alamat belum disimpan">
        <p className="text-sm leading-7 text-secondary">Simpan perubahan alamat sebelum menutup?</p>
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <Button variant="ghost" onClick={() => setDirtyClose(false)}>
            Lanjut edit
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setDirtyClose(false);
              setAddressOpen(false);
            }}
          >
            Buang perubahan
          </Button>
          <Button onClick={saveAddress}>Simpan</Button>
        </div>
      </Dialog>
    </>
  );
}
