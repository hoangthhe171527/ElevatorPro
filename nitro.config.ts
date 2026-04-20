import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
  preset: "netlify",
  noExternals: ["tslib"],
  rollupConfig: {
    external: ["@tanstack/react-router", /^@radix-ui\/react-.*/],
  },
});