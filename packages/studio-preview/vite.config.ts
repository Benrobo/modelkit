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
    // Reload when the linked @modelkit/studio package is rebuilt (run studio's `dev` in another terminal)
    watch: {
      ignored: (path) => {
        const n = path.replace(/\\/g, "/");
        if (!n.includes("node_modules")) return false;
        return !n.includes("node_modules/@modelkit/studio");
      },
    },
  },
  preview: {
    port: 3480,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@modelkit/studio/styles": resolve(
        __dirname,
        "../studio/src/styles/globals.css"
      ),
    },
  },
  optimizeDeps: {
    exclude: ["@modelkit/studio"],
  },
});
