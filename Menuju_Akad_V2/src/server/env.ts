import "server-only";
import { z } from "zod";

const environment = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  UI_PREVIEW_ENABLED: z.enum(["true", "false"]).optional(),
});
export function isPreviewEnabled() {
  const env = environment.parse(process.env);
  return (
    env.UI_PREVIEW_ENABLED === "true" ||
    (env.NODE_ENV !== "production" && env.UI_PREVIEW_ENABLED !== "false")
  );
}
