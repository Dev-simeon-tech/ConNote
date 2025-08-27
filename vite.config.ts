import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      // svgr options: https://react-svgr.com/docs/options/
      svgrOptions: {
        icon: true,
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["cn-logo", "hero-illustration"],
      manifest: {
        name: "ConNote Tool App",
        short_name: "ConNote",
        description:
          "ConNote - Student's Personal unit calculator and Note-Summarizing App",
        display: "standalone",
        theme_color: "#006a10",
        background_color: "#ffffff",
        lang: "en",
        start_url: "/",
        scope: "/",
        id: "https://con-note.vercel.app/",
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
        categories: ["education", "productivity"],
        shortcuts: [
          {
            name: "Summarizer",
            url: "https://con-note.vercel.app/tools/summarizer",
            description: "pdf and pptx summarizer tool",
          },
          {
            name: "Currency",
            url: "https://con-note.vercel.app/tools/currency",
            description: "currency converter tool",
          },
          {
            name: "Time",
            url: "https://con-note.vercel.app/tools/time",
            description: "Time converter tool",
          },
        ],
        screenshots: [
          {
            src: "screenshots/home.png",
            type: "image/png",
            sizes: "1080x1920",
            label: "Home Screen",
          },
          {
            src: "screenshots/summarizer.png",
            type: "image/png",
            sizes: "1080x1920",
            label: "pdf and pptx summarizer tool",
          },
        ],
      },
    }),
  ],
});
