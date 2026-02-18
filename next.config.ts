import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/socket/:path*",
        destination: "/api/socket/:path*",
      },
    ];
  },
};

export default nextConfig;
