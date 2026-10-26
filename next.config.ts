import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  async redirects() {
    return [
      { source: "/products", destination: "/services", permanent: true },
      { source: "/quality-responsibility", destination: "/careers", permanent: true },
      { source: "/quality-and-responsibility", destination: "/careers", permanent: true },
    ];
  },
};

export default nextConfig;
