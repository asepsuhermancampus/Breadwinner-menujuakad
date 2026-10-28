import type { NextConfig } from "next";
const devOrigins = ["127.0.0.1", "[::1]"];
try {
  const publicUrl = process.env.AUTH_URL?.trim() || process.env.NEXTAUTH_URL?.trim();
  if (publicUrl) {
    const parsed = new URL(publicUrl);
    if (["http:", "https:"].includes(parsed.protocol)) devOrigins.push(parsed.hostname);
  }
} catch {
  /* Invalid application URLs do not authorize extra development hosts. */
}

const config: NextConfig = {
  allowedDevOrigins: devOrigins,
  distDir: process.env["NEXT_DIST_DIR"] || ".next",
  output: "standalone",
  poweredByHeader: false,
  async redirects() {
    return ["/dashboard/settings", "/dashboard/settings/profile", "/dashboard/account"]
      .map((source) => ({ source, destination: "/account", permanent: false }))
      .concat([
        {
          source: "/dashboard/settings/security",
          destination: "/account/security",
          permanent: false,
        },
      ]);
  },
  async headers() {
    return [
      {
        source: "/assets/fonts/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, OPTIONS" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "Referrer-Policy", value: "same-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};
export default config;
