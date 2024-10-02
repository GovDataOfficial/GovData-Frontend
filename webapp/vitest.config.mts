import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "vitest.setup.ts",
    coverage: {
      provider: 'v8',
      reporter: ['cobertura'],
      include: ["src"],
    },
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
    },
  },
});
