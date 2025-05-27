import { defineConfig } from "vite";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  root: resolve(__dirname, "src"),
  publicDir: resolve(__dirname, "src", "public"),
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      strategies: "injectManifest",
      srcDir: ".",
      filename: "sw.js",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "starter-project-with-vite",
        short_name: "MyApp",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: true,
      },

      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
});
