import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 15 performance optimizations (stable features only)
  experimental: {
    // Enable optimized package imports (stable in Next.js 15)
    optimizePackageImports: [
      "@radix-ui/react-dialog",
      "@radix-ui/react-tabs",
      "@radix-ui/react-select",
      "lucide-react",
      "framer-motion",
    ],
    // Server component caching (stable in Next.js 15)
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/vi/**",
      },
    ],
  },
  // Output optimization
  output: "standalone",
  // Enable compression
  compress: true,
};

export default nextConfig;
