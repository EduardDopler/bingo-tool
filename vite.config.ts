/// <reference types="vitest" />
import { defineConfig } from "vite";

// Ensure base path starts and ends with a slash, and contains no duplicate slashes
let base = process.env.VITE_PUBLIC_PATH || "/";
if (!base.startsWith("/")) {
  base = "/" + base;
}
if (!base.endsWith("/")) {
  base = base + "/";
}
base = base.replace(/\/+/g, "/");

export default defineConfig({
  base,
  test: {
    environment: "node",
    globals: true,
    include: ["src/tests/**/*.test.ts"],
  },
});
