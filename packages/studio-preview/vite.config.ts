import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3480,
    strictPort: true,
  },
  preview: {
    port: 3480,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@modelkit/studio/styles": resolve(__dirname, "../studio/dist/styles.css"),
    },
  },
});
