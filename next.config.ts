import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
      },
    ],
  },
  // Suppress build warnings for pages using useSearchParams
  // The Suspense boundary fix in the component handles this properly
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
