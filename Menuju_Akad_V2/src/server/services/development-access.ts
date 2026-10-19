import "server-only";
import { notFound } from "next/navigation";
import { serverEnv } from "../env";

export function requireDevelopmentAccess() {
  if (serverEnv().NODE_ENV === "production") notFound();
}
