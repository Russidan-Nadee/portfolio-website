import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: "",
  assetPrefix: "",
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
