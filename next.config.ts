import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",
  images: {
    unoptimized: true, // 👈 disables the image optimization API
  },
};

export default nextConfig;
