import "server-only";
import type { DatabaseSync } from "node:sqlite";
export interface PublishedInvitation {
  title: string;
  groom?: string;
  bride?: string;
  date?: string;
  venue?: string;
  template: string;
}
export function readPublishedInvitation(
  db: DatabaseSync,
  workspaceId: string,
  id: string,
): PublishedInvitation | null {
  const row = db
    .prepare(
      `SELECT j.value AS data FROM workspace_resources r, json_each(r.data) j WHERE r.workspace_id=? AND r.kind='invitations' AND json_extract(j.value,'$.id')=? AND json_extract(j.value,'$.published')=1 LIMIT 1`,
    )
    .get(workspaceId, id);
  return row ? (JSON.parse(String(row["data"])) as PublishedInvitation) : null;
}
