import type { NextConfig } from "next";

// Static export; vercel.json holds the redirects and response headers.
const nextConfig: NextConfig = {
  output: "export",
  // Separate build dir lets `next build` run while `next dev` is using .next
  distDir: process.env.NEXT_DIST_DIR || ".next",
  trailingSlash: true,
  images: { unoptimized: true },
  // Branded 404 for unmatched URLs (the app has two root layouts, so a plain not-found.tsx cannot cover them).
  experimental: { globalNotFound: true },
  turbopack: {
    // In the browser "@/content" is the lazy version, so no page pays for the text of every language up front (lib/content-lazy.ts). The server keeps the real module.
    resolveAlias: { "@/content": { browser: "./src/lib/content-lazy.ts" } },
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
