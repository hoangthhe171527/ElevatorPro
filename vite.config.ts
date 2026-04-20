import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tanstackStart(), nitro({ preset: "netlify" }), react(), tailwindcss(), tsconfigPaths()],
  ssr: {
    external: ["@tanstack/react-router", /^@radix-ui\/react-.*/],
    noExternal: ["tslib", "zustand", "sonner"],
  },
});