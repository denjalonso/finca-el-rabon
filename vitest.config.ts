import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      include: [
        "src/pages/api/**/*.ts",
        "src/components/**/*.tsx",
      ],
    },
  },
});
