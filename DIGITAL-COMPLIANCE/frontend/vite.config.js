import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Use Vite's import.meta.env instead of process.env
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: import.meta.env.VITE_BACKEND_URL, // Use Vite's environment variable
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: {
    allowedHosts: [new URL(import.meta.env.VITE_BACKEND_URL).host], // Extract host dynamically
  },
});
