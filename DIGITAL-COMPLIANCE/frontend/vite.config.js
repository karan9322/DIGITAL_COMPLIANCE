import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Use process.env for fallback in vite.config.js
const backendUrl =
  process.env.VITE_BACKEND_URL || "https://digital-compliance.onrender.com";

console.log("Backend URL:", backendUrl);

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: backendUrl, // Use the backend URL fenv or default
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: {
    allowedHosts: [
      "digital-compliance-1-6632.onrender.com", // Add Render domain
      new URL(backendUrl).host, // Extract host dynamically
    ],
  },
});
