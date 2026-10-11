import type { NextConfig } from "next";

// Static export → deploy the `out/` folder to Cloudflare Pages (free tier, commercial use allowed).
const nextConfig: NextConfig = {
  output: "export",
  // Separate build dir lets `next build` run while `next dev` is using .next
  distDir: process.env.NEXT_DIST_DIR || ".next",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
