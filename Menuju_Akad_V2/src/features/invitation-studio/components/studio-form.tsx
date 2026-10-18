"use client";

import { Field } from "@/components/ui/field";
import type { StudioEditor } from "../hooks/use-studio-editor";

export function StudioForm({ editor }: { editor: StudioEditor }) {
  const { state, content } = editor;
  const value = state.document.content;
  return (
    <div className="grid gap-5">
      <h2 className="text-sm font-semibold">Profil & detail acara</h2>
      <Field
        label="Nama mempelai pria"
        value={value.groom}
        onChange={(event) => content({ groom: event.target.value })}
      />
      <Field
        label="Nama mempelai wanita"
        value={value.bride}
        onChange={(event) => content({ bride: event.target.value })}
      />
      <Field
        label="Judul pasangan"
        value={value.coupleTitle}
        onChange={(event) => content({ coupleTitle: event.target.value })}
      />
      <Field
        type="date"
        label="Tanggal acara"
        value={value.date}
        onChange={(event) => content({ date: event.target.value })}
      />
      <Field
        label="Lokasi"
        value={value.venue}
        onChange={(event) => content({ venue: event.target.value })}
      />
      <label className="flex min-h-11 items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={value.pinSet}
          onChange={(event) => content({ pinSet: event.target.checked })}
        />
        Pin venue sudah ditinjau
      </label>
      <Field
        label="Batas RSVP"
        value={value.rsvpDeadline}
        onChange={(event) => content({ rsvpDeadline: event.target.value })}
      />
      <p className="text-xs leading-relaxed text-secondary">
        Perubahan terlihat pada draf yang sama di mode Visual. Versi aktif dan jawaban RSVP tetap
        tersimpan terpisah.
      </p>
    </div>
  );
}
