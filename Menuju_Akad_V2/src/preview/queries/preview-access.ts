import "server-only";
import { isPreviewEnabled } from "@/server/env";

export function canViewPreview() {
  return isPreviewEnabled();
}
