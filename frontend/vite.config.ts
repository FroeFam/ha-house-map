import { defineConfig } from "vite";

// Builds one ES module that HA loads as the custom panel. Lit is bundled in.
export default defineConfig({
  build: {
    lib: {
      entry: "src/house-map-panel.ts",
      formats: ["es"],
      fileName: () => "house-map-panel.js",
    },
    outDir: "../custom_components/house_map/frontend",
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
    target: "es2022",
  },
});
