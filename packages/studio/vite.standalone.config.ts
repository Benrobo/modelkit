/**
 * Standalone build — bundles React + everything into a single IIFE JS file
 * plus a single CSS file. Used by the SDK to serve the Studio without any
 * external dependencies.
 *
 * Output: dist-standalone/studio.iife.js + dist-standalone/studio.css
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    outDir: "dist-standalone",
    minify: true,
    lib: {
      entry: path.resolve(__dirname, "src/standalone.tsx"),
      name: "ModelKitStudioLib",
      formats: ["iife"],
      fileName: () => "studio.iife.js",
    },
    rollupOptions: {
      // No externals — bundle everything including React
      output: {
        assetFileNames: () => "studio.css",
      },
    },
  },
});
