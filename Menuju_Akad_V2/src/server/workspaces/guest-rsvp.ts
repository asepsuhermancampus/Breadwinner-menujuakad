import "server-only";
import type { DatabaseSync } from "node:sqlite";
import { PaymentError } from "@/server/payments/errors";
type Guest = {
  id: string;
  name: string;
  personalToken: string;
  quota: number;
  rsvpStatus: string;
  attendingCount: number;
  isArchived?: boolean;
};
export class GuestRsvpService {
  constructor(private db: DatabaseSync) {}
  private locate(token: string) {
    if (!/^[a-zA-Z0-9_-]{20,160}$/.test(token)) return null;
    const matches = this.db
      .prepare(
        "SELECT r.workspace_id,r.data,r.revision,j.value AS guest FROM workspace_resources r,json_each(r.data) j WHERE r.kind='guests' AND json_extract(j.value,'$.personalToken')=? LIMIT 2",
      )
      .all(token);
    if (matches.length !== 1) return null;
    const row = matches[0]!,
      guest = JSON.parse(String(row.guest)) as Guest;
    if (guest.isArchived) return null;
    const basic = this.db
      .prepare(
        "SELECT j.value AS doc FROM workspace_resources r,json_each(r.data) j WHERE r.workspace_id=? AND r.kind='invitations' AND json_extract(j.value,'$.published')=1 LIMIT 1",
      )
      .get(row.workspace_id!);
    const studio = !basic
      ? this.db
          .prepare(
            "SELECT json_extract(j.value,'$.activeDocument.content') AS doc FROM workspace_resources r,json_each(r.data) j WHERE r.workspace_id=? AND r.kind='studio-drafts' AND json_extract(j.value,'$.document.publication')='published' AND json_extract(j.value,'$.activeDocument.publication')='published' LIMIT 1",
          )
          .get(row.workspace_id!)
      : null;
    const content = basic ?? studio;
    if (!content?.doc) return null;
    const doc = JSON.parse(String(content.doc)) as {
      title?: string;
      coupleTitle?: string;
      date?: string;
      venue?: string;
      rsvpDeadline?: string;
    };
    if (
      doc.rsvpDeadline &&
      Number.isFinite(Date.parse(doc.rsvpDeadline)) &&
      Date.parse(doc.rsvpDeadline) < Date.now()
    )
      return null;
    return { row, guest, doc };
  }
  read(token: string) {
    const found = this.locate(token);
    if (!found) return null;
    return {
      name: found.guest.name,
      quota: found.guest.quota,
      rsvpStatus: found.guest.rsvpStatus,
      attendingCount: found.guest.attendingCount,
      title: found.doc.title ?? found.doc.coupleTitle ?? "Undangan kalian",
      date: found.doc.date ?? "",
      venue: found.doc.venue ?? "",
    };
  }
  respond(token: string, status: string, count: number) {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const found = this.locate(token);
      if (!found) throw new PaymentError("Undangan tidak tersedia.", 404);
      if (
        !["ATTENDING", "DECLINED", "PENDING"].includes(status) ||
        !Number.isInteger(count) ||
        count < 0 ||
        count > found.guest.quota ||
        (status === "ATTENDING" && count < 1) ||
        (status !== "ATTENDING" && count !== 0)
      )
        throw new PaymentError("Jumlah kehadiran tidak sesuai kuota.", 400);
      const items = JSON.parse(String(found.row.data)) as Guest[];
      const next = items.map((g) =>
        g.id === found.guest.id ? { ...g, rsvpStatus: status, attendingCount: count } : g,
      );
      this.db
        .prepare(
          "UPDATE workspace_resources SET data=?,revision=revision+1 WHERE workspace_id=? AND kind='guests'",
        )
        .run(JSON.stringify(next), found.row.workspace_id!);
      this.db.exec("COMMIT");
      return this.read(token);
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
  }
}
