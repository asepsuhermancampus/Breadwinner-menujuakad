"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { useAccountOperation } from "../hooks/use-account-operation";
import { profileSchema } from "../schemas/profile";
import type { AccountAdapter, AccountProfile } from "../types/account";
import { OperationFeedback } from "./operation-feedback";
import styles from "./account.module.css";

type EditableProfile = Pick<AccountProfile, "fullName" | "email" | "phone" | "culture">;

function editableProfile(profile: AccountProfile): EditableProfile {
  const { fullName, email, phone, culture } = profile;
  return { fullName, email, phone, culture };
}

export function ProfileForm({
  profile,
  adapter,
  onSaved,
}: {
  profile: AccountProfile;
  adapter: AccountAdapter;
  onSaved: (profile: AccountProfile) => void;
}) {
  const [draft, setDraft] = useState<EditableProfile>(() => editableProfile(profile));
  const [errors, setErrors] = useState<Partial<Record<keyof EditableProfile, string>>>({});
  const mutation = useAccountOperation();
  const dirty = (Object.keys(draft) as (keyof EditableProfile)[]).some(
    (key) => draft[key] !== profile[key],
  );

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = profileSchema.safeParse({
      ...draft,
      expectedVersion: profile.version,
    });
    if (!parsed.success) {
      const nextErrors: Partial<Record<keyof EditableProfile, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && field in draft) {
          nextErrors[field as keyof EditableProfile] = issue.message;
        }
      }
      setErrors(nextErrors);
      const firstField = parsed.error.issues[0]?.path[0];
      if (typeof firstField === "string") {
        const input = event.currentTarget.elements.namedItem(firstField);
        if (input instanceof HTMLElement) input.focus();
      }
      return;
    }
    setErrors({});
    const result = await mutation.run(
      () => adapter.saveProfile(parsed.data),
      "Perubahan profil disimpan pada pratinjau.",
    );
    if (result.ok) {
      setDraft(editableProfile(result.data));
      onSaved(result.data);
    }
  }

  function update(key: keyof EditableProfile, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className={styles.panel} aria-labelledby="personal-profile">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="personal-profile">Profil pribadi</h2>
        <span className={styles.badge}>{profile.roleLabel}</span>
      </div>
      <form onSubmit={save} noValidate className={styles.stack}>
        <Field
          label="Nama lengkap"
          name="fullName"
          value={draft.fullName}
          autoComplete="name"
          onChange={(event) => update("fullName", event.target.value)}
          error={errors.fullName ?? ""}
          disabled={mutation.pending}
        />
        <div className={styles.formGrid}>
          <Field
            label="Alamat email"
            name="email"
            type="email"
            value={draft.email}
            autoComplete="email"
            onChange={(event) => update("email", event.target.value)}
            error={errors.email ?? ""}
            disabled={mutation.pending}
          />
          <Field
            label="Nomor WhatsApp"
            name="phone"
            type="tel"
            value={draft.phone}
            autoComplete="tel"
            onChange={(event) => update("phone", event.target.value)}
            error={errors.phone ?? ""}
            disabled={mutation.pending}
          />
        </div>
        <p className={styles.finePrint}>
          Perubahan kontak pada pratinjau tidak memverifikasi email atau nomor.
        </p>
        <Field
          label="Preferensi adat"
          name="culture"
          value={draft.culture}
          onChange={(event) => update("culture", event.target.value)}
          error={errors.culture ?? ""}
          disabled={mutation.pending}
        />
        <OperationFeedback feedback={mutation.feedback} />
        <div className={styles.actions}>
          {dirty && <span className={styles.finePrint}>Perubahan belum disimpan</span>}
          <Button
            type="submit"
            disabled={!dirty || mutation.pending}
            className="bg-foreground text-white hover:bg-foreground/90"
          >
            {mutation.pending ? "Menyimpan…" : "Simpan perubahan"}
          </Button>
        </div>
      </form>
    </section>
  );
}
