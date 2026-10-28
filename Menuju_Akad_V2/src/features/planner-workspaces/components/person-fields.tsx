"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Status } from "@/components/ui/status";
import type { PersonProfile, WorkspaceAdapter } from "../contracts";
import { photoError, type FormErrors } from "../utils/onboarding-validation";

export function PersonFields({
  person,
  value,
  errors,
  adapter,
  onChange,
}: {
  person: "groom" | "bride";
  value: PersonProfile;
  errors: FormErrors;
  adapter: WorkspaceAdapter;
  onChange: (patch: Partial<PersonProfile>) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const title = person === "groom" ? "MEMPELAI PRIA" : "MEMPELAI WANITA";

  async function upload(file: File | undefined) {
    if (!file || pending) return;
    const invalid = photoError(file);
    if (invalid) {
      setError(invalid);
      return;
    }
    setError("");
    setPending(true);
    try {
      const photoUrl = await adapter.uploadPhoto(file);
      onChange({ photoUrl });
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Foto gagal diunggah. Coba lagi.");
    } finally {
      setPending(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <section className="min-w-0 space-y-4" aria-label={title}>
      <div className="flex items-center gap-3">
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-subtle text-[22px] text-brand-secondary">
          {value.photoUrl ? (
            // Uploaded preview images may be local data/blob URLs.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value.photoUrl}
              alt={`Foto ${value.fullName}`}
              className="size-full object-cover"
            />
          ) : (
            value.nickname.slice(0, 1).toUpperCase()
          )}
        </div>
        <div>
          <p className="text-[11px] tracking-[0.7px] text-secondary">{title}</p>
          <Button
            variant="ghost"
            className="-ml-3 min-h-11 text-xs text-brand-secondary"
            disabled={pending}
            onClick={() => input.current?.click()}
          >
            {pending ? "Mengunggah foto…" : "+ Unggah foto"}
          </Button>
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            aria-label={`Unggah foto ${title.toLowerCase()}`}
            onChange={(event) => {
              void upload(event.target.files?.[0]);
            }}
          />
        </div>
      </div>
      {error && (
        <Status tone="danger">
          {error}
          {value.photoUrl ? " Foto sebelumnya tetap tersimpan." : ""}
        </Status>
      )}
      <Field
        id={`${person}-name`}
        label="Nama lengkap"
        value={value.fullName}
        error={errors[`${person}.fullName`]}
        autoComplete="name"
        onChange={(event) => onChange({ fullName: event.target.value })}
      />
      <Field
        id={`${person}-nickname`}
        label="Nama panggilan"
        value={value.nickname}
        error={errors[`${person}.nickname`]}
        onChange={(event) => onChange({ nickname: event.target.value })}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id={`${person}-father`}
          label="Nama ayah"
          value={value.father}
          onChange={(event) => onChange({ father: event.target.value })}
        />
        <Field
          id={`${person}-mother`}
          label="Nama ibu"
          value={value.mother}
          onChange={(event) => onChange({ mother: event.target.value })}
        />
      </div>
    </section>
  );
}
