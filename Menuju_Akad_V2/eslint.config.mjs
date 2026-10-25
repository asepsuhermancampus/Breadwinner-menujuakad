import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    ".next/**",
    ".next-reviews/**",
    "src/generated/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
  {
    files: ["src/features/**/*.{ts,tsx}", "src/components/**/*.{ts,tsx}"],
    ignores: ["**/*.test.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/preview/**", "**/fixtures/**"],
              message:
                "Inject adapter/DTO via composition root; product modules cannot import fixtures.",
            },
            {
              group: ["@prisma/*", "@neondatabase/*", "@/server/db/**", "@/generated/**"],
              message: "Database queries belong in repositories.",
            },
          ],
        },
      ],
    },
  },
]);
