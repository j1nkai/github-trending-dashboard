import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  assetPrefix: "/github-trending-dashboard/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
