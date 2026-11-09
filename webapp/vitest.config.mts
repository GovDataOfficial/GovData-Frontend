import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "vitest.setup.ts",
    // JUnit XML for the GitLab pipeline Tests tab (reports:junit of the npm test job).
    reporters: ["default", "junit"],
    outputFile: { junit: "coverage/junit.xml" },
    coverage: {
      provider: "v8",
      reporter: ["clover", "text-summary", "cobertura", "html"],
      include: ["src"],
      exclude: [
        "**/.DS_Store",
        "**/vitest.setup.ts",
        "**/__tests__/**",
        "**/*.svg",
      ],
    },
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
    },
  },
});
