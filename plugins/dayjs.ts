import { defineNuxtPlugin } from "#app";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.provide("dayjs", dayjs);
  nuxtApp.vueApp.provide("relativeTime", relativeTime);
});
