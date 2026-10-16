import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The browser only talks to this origin; /api/* is forwarded to the MCL-CRM-Backend Express API,
  // so its session cookie is first-party and no CORS is needed.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${process.env.API_URL ?? "http://localhost:4000"}/api/:path*` }];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
