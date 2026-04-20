import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "**.eternalstar.xzy"
      },
      {
        protocol: "http",
        hostname: "**.eternalstar.xzy"
      }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256]
  },

  experimental: {
    optimizeCss: true
  }
};

module.exports = nextConfig;

export default nextConfig;
