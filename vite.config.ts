import { defineConfig, loadEnv } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// Figma Make asset resolver (keep as-is)
function figmaAssetResolver() {
  return {
    name: "figma-asset-resolver",
    resolveId(id: string) {
      if (id.startsWith("figma:asset/")) {
        const filename = id.replace("figma:asset/", "");
        return path.resolve(__dirname, "src/assets", filename);
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const devApiTarget =
    env.VITE_DEV_API_TARGET || "https://smarthomebackend-production.up.railway.app";

  return {
    plugins: [figmaAssetResolver(), react(), tailwindcss()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    assetsInclude: ["**/*.svg", "**/*.csv"],

    // Production build settings
    build: {
      outDir: "dist",
      sourcemap: false,
      rollupOptions: {
        output: {
          // Split vendor libs into separate chunks for better caching
          manualChunks: {
            react: ["react", "react-dom"],
            recharts: ["recharts"],
            radix: [
              "@radix-ui/react-dialog",
              "@radix-ui/react-dropdown-menu",
              "@radix-ui/react-select",
              "@radix-ui/react-tabs",
            ],
          },
        },
      },
    },

    // Local dev: proxy API calls to avoid CORS in development
    server: {
      host: "127.0.0.1",
      port: 5173,
      strictPort: true,
      proxy: {
        "/api": {
          target: devApiTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
