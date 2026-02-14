import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      include: ["src"],
      exclude: ["**/*.test.ts", "**/*.test.tsx"],
      insertTypesEntry: false,
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "modelkit"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    sourcemap: true,
    minify: true,
  },
});
