import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: import.meta.env.VITE_BACKEND_URL,
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: {
    allowedHosts: [
      "digital-compliance-1-6632.onrender.com", // Add your deployed domain
      new URL(import.meta.env.VITE_BACKEND_URL).host, // Keep dynamic extraction
    ],
  },
});
