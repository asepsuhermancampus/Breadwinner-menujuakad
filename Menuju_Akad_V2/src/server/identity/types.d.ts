import type { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id?: string;
      ownerKey?: string;
      role?: "customer" | "admin" | "superadmin" | "vendor" | "ambassador";
      authMethod?: string;
      authenticatedAt?: number;
    };
  }
}
