import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
  preset: "vercel",
  externals: {
    inline: ["tslib"],
  },
});