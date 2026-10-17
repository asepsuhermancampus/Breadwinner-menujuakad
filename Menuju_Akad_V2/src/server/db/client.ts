import "server-only";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";
import { z } from "zod";

const connectionSchema = z
  .string()
  .url()
  .refine((url) => url.startsWith("postgresql://") || url.startsWith("postgres://"));
const globalDatabase = globalThis as unknown as { menujuAkadDatabase?: PrismaClient };
export function getDatabase() {
  if (globalDatabase.menujuAkadDatabase) return globalDatabase.menujuAkadDatabase;
  const connectionString = connectionSchema.parse(process.env.DATABASE_URL);
  const adapter = new PrismaNeon({ connectionString, max: 5, connectionTimeoutMillis: 5_000 });
  const client = new PrismaClient({ adapter });
  globalDatabase.menujuAkadDatabase = client;
  return client;
}
