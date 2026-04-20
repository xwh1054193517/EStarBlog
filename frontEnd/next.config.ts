import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // 👈 必须添加这一行,
  images: {
    formats: ["image/avif", "image/webp"]
  }
};

module.exports = nextConfig;

export default nextConfig;
