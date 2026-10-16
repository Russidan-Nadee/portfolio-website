import type { NextConfig } from "next";

const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL)
  : null;

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: supabaseOrigin
      ? [
          {
            protocol: supabaseOrigin.protocol === "http:" ? "http" : "https",
            hostname: supabaseOrigin.hostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  basePath: "",
  assetPrefix: "",
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
