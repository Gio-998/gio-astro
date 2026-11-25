import type { NextConfig } from "next";

// Static export; vercel.json holds the redirects and response headers.
// APP_EXPORT=1 is set only by scripts/build-app.mjs (`npm run build:app`, the store app). The website build never sets it.
const APP_EXPORT = process.env.APP_EXPORT === "1";

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
    resolveAlias: {
      "@/content": { browser: "./src/lib/content-lazy.ts" },
      // App-only code (native boot, tabs, live daily text, reminders, widget) lives behind "@/app-mode". The site gets the inert stubs in src/app-mode/index.ts.
      ...(APP_EXPORT ? { "@/app-mode": "./src/app-mode/native.tsx" } : {}),
    },
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
