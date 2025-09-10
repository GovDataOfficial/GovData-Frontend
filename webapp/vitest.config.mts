import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "vitest.setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["clover"],
      include: ["src"],
    },
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
    },
  },
});
