import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ftocxmbnabidlalbokfk.supabase.co",
        pathname: "/**",
      },
    ],
    qualities: [100, 75],
  },
};

export default nextConfig;
