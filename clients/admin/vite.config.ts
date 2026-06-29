import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiBase = env.VITE_API_BASE_URL ?? "http://localhost:5030";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      // Aliases below that point at ./node_modules are required because
      // ../shared/src is source-included (not a published package). Without
      // them, bare imports from shared files walk upward past the app root
      // and fail to resolve (or resolve to the wrong copy).
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@shared": path.resolve(__dirname, "../shared/src"),
        "lucide-react": path.resolve(__dirname, "./node_modules/lucide-react"),
        i18next: path.resolve(__dirname, "./node_modules/i18next"),
        "i18next-browser-languagedetector": path.resolve(
          __dirname,
          "./node_modules/i18next-browser-languagedetector",
        ),
        react: path.resolve(__dirname, "./node_modules/react"),
        "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime.js"),
        "react-i18next": path.resolve(__dirname, "./node_modules/react-i18next"),
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        "/api": { target: apiBase, changeOrigin: true, secure: false },
        "/health": { target: apiBase, changeOrigin: true, secure: false },
        "/openapi": { target: apiBase, changeOrigin: true, secure: false },
        "/scalar": { target: apiBase, changeOrigin: true, secure: false },
      },
    },
  };
});
