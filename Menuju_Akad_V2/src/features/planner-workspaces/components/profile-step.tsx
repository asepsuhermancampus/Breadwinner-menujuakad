"use client";

import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import type { OnboardingDraft, PersonProfile, WorkspaceAdapter } from "../contracts";
import type { FormErrors } from "../utils/onboarding-validation";
import { PersonFields } from "./person-fields";

export function ProfileStep({
  draft,
  adapter,
  errors,
  onChange,
}: {
  draft: OnboardingDraft;
  adapter: WorkspaceAdapter;
  errors: FormErrors;
  onChange: (updater: (draft: OnboardingDraft) => OnboardingDraft) => void;
}) {
  function changePerson(person: "bride" | "groom", patch: Partial<PersonProfile>) {
    onChange((current) => ({
      ...current,
      profile: { ...current.profile, [person]: { ...current.profile[person], ...patch } },
    }));
  }
  return (
    <Card className="space-y-6 p-5 md:p-7">
      <div className="grid gap-8 md:grid-cols-2">
        {(["groom", "bride"] as const).map((person) => (
          <PersonFields
            key={person}
            person={person}
            value={draft.profile[person]}
            adapter={adapter}
            errors={errors}
            onChange={(patch) => changePerson(person, patch)}
          />
        ))}
      </div>
      <div className="grid gap-6 border-t border-border pt-6 md:grid-cols-2">
        <Select
          id="culture"
          label="Preferensi adat / budaya"
          value={draft.profile.culture}
          onChange={(event) =>
            onChange((current) => ({
              ...current,
              profile: { ...current.profile, culture: event.target.value },
            }))
          }
        >
          <option value="">Belum menentukan</option>
          <option>Jawa modern</option>
          <option>Sunda</option>
          <option>Minang</option>
          <option>Nasional</option>
          <option>Lainnya</option>
        </Select>
        <Select
          id="actor-role"
          label="Peran kamu dalam rencana ini"
          value={draft.profile.actorRole}
          onChange={(event) => {
            const actorRole = event.target.value === "groom" ? "groom" : "bride";
            onChange((current) => ({ ...current, profile: { ...current.profile, actorRole } }));
          }}
        >
          <option value="bride">Mempelai wanita</option>
          <option value="groom">Mempelai pria</option>
        </Select>
      </div>
      <p className="text-xs leading-6 text-secondary">
        Nama orang tua dapat diedit kembali sebelum undangan diterbitkan.
      </p>
    </Card>
  );
}
