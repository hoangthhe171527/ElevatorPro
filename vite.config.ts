import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tanstackStart(), nitro({ preset: "netlify" }), react(), tailwindcss(), tsconfigPaths()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE" && warning.message.includes(`"use client"`)) {
          return;
        }
        warn(warning);
      },
    },
  },
  ssr: {
    noExternal: ["tslib", "zustand", "sonner", "lucide-react"],
  },
});
