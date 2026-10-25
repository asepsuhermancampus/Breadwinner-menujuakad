import type { NextConfig } from "next";

const config: NextConfig = {
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
