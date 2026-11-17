import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" keeps every asset path relative, so the build works at the root of
// Vercel/Netlify and also under a sub-path (for example GitHub Pages).
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: { host: true },
  build: {
    target: "es2019",
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          motion: ["framer-motion", "gsap"]
        }
      }
    }
  }
});
