import { defineNuxtConfig } from "nuxt3";

const lifecycle = process.env.npm_lifecycle_event;

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  nitro: {
    preset: "vercel",
  },
  build: {
    transpile: ["primevue", "dayjs"],
  },
  publicRuntimeConfig: {
    TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
    TWITCH_REDIRECT_URL: process.env.TWITCH_REDIRECT_URL,
  },
  privateRuntimeConfig: {
    TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET,
  },
  plugins: ["@/plugins/pinia.client.ts", "@/plugins/primevue.ts"],
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],
  css: [
    "primevue/resources/themes/vela-purple/theme.css",
    "primevue/resources/primevue.css",
    "primeflex/primeflex.css",
    "primeicons/primeicons.css",
    "@/styles/global.css",
  ],
});
