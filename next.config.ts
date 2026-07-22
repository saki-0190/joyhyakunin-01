import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [];
  },
  allowedDevOrigins: ["192.168.10.112"],
};

export default nextConfig;
