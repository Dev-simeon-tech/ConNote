import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["cn-logo", "hero-illustration"],
      manifest: {
        name: "ConNote App",
        short_name: "ConNote",
        description:
          "ConNote - Student's Personal unit calculator and Note-Summarizing App",
        display: "standalone",
        theme_color: "#42b883",
        background_color: "#ffffff",
        lang: "en",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "cn-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "cn-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
