import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: "5M",
    rollupOptions: {
      input: {
        main: "./index.html",
        Background: "./src/Background.ts",
        ContentScript: "./src/ContentScript.ts",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
    outDir: "build",
  },
});
