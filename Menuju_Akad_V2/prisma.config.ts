import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env.DIRECT_URL || "postgresql://v2:v2@localhost:5432/menujuakad_v2" },
});
