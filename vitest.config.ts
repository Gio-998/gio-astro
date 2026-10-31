import { defineConfig } from "vitest/config";
import path from "node:path";
// The copy check reads all of src and the horoscope tests compute real skies, so the default 5 s fails them on a busy machine.
export default defineConfig({ test: { include: ["tests/**/*.test.ts"], testTimeout: 60_000 }, resolve: { alias: { "@": path.resolve(__dirname, "src") } } });
