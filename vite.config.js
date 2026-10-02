import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        // API_PROXY_TARGET points a second dev server at another Functions
        // host, such as one running against the local Stripe and email stubs.
        target: process.env.API_PROXY_TARGET ?? "http://127.0.0.1:7071",
        changeOrigin: true,
      },
    },
  },
});
