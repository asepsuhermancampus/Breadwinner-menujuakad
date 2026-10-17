import type { EventPlan, OnboardingDraft } from "../contracts";

export type FormErrors = Record<string, string>;

function validDate(value: string) {
  const parsed = new Date(`${value}T00:00:00+07:00`);
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(parsed.getTime()) &&
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(parsed) === value
  );
}

export function profileErrors(draft: OnboardingDraft): FormErrors {
  const errors: FormErrors = {};
  for (const person of ["groom", "bride"] as const) {
    for (const field of ["fullName", "nickname"] as const) {
      if (!draft.profile[person][field].trim()) {
        errors[`${person}.${field}`] = "Nama wajib diisi.";
      }
    }
  }
  return errors;
}

export function eventErrors(draft: OnboardingDraft): FormErrors {
  const errors: FormErrors = {};
  for (const kind of ["engagement", "wedding"] as const) {
    if (draft.scope !== "both" && draft.scope !== kind) continue;
    const event = draft.events[kind];
    if (!validDate(event.date)) errors[`${kind}.date`] = "Tanggal acara tidak valid.";
    if (!event.city.trim()) errors[`${kind}.city`] = "Kota acara wajib diisi.";
    if (!Number.isSafeInteger(event.budgetIdr) || event.budgetIdr < 0) {
      errors[`${kind}.budgetIdr`] = "Anggaran harus bilangan rupiah utuh, minimal 0.";
    }
    if (!Number.isSafeInteger(event.guestEstimate) || event.guestEstimate < 0) {
      errors[`${kind}.guestEstimate`] = "Jumlah undangan harus bilangan bulat, minimal 0.";
    }
  }
  if (draft.events.engagement.id === draft.events.wedding.id) {
    errors["eventId"] = "Identitas acara lamaran dan pernikahan harus berbeda.";
  }
  return errors;
}

export function updateEvent(
  draft: OnboardingDraft,
  kind: EventPlan["kind"],
  patch: Partial<Omit<EventPlan, "id" | "kind">>,
): OnboardingDraft {
  return { ...draft, events: { ...draft.events, [kind]: { ...draft.events[kind], ...patch } } };
}

export function photoError(file: Pick<File, "size" | "type">): string | null {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return "Gunakan foto JPG, PNG, atau WebP.";
  }
  if (file.size > 5 * 1024 * 1024) return "Ukuran foto maksimal 5 MB.";
  if (file.size === 0) return "Berkas foto kosong.";
  return null;
}
