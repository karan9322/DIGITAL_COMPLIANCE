import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

console.log("VITE_BACKEND_URL:", process.env.VITE_BACKEND_URL);

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: process.env.VITE_BACKEND_URL, // Use process.env instead
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: {
    allowedHosts: [new URL(process.env.VITE_BACKEND_URL).host], // Extract host dynamically
  },
});
