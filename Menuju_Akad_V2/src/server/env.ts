import "server-only";
import { z } from "zod";

const environment = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});
export function serverEnv() {
  return environment.parse(process.env);
}
