import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for catching bugs early
  reactStrictMode: true,

  // Transpile workspace packages
  transpilePackages: [
    "@planetcode/db",
    "@planetcode/types",
    "@planetcode/validators",
  ],

  // Security headers (§17)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // TODO: Add Content-Security-Policy header (§17)
          // TODO: Add Strict-Transport-Security for production
        ],
      },
    ];
  },
};

export default nextConfig;
