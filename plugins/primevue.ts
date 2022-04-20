import { defineNuxtPlugin } from "#app";
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import Password from "primevue/password";
import Card from "primevue/card";
import ProgressSpinner from "primevue/progressspinner";
import Menu from "primevue/menu";
import Badge from "primevue/badge";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import BadgeDirective from "primevue/badgedirective";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, { ripple: true });
  nuxtApp.vueApp.use(ToastService);
  nuxtApp.vueApp.component("Button", Button);
  nuxtApp.vueApp.component("Password", Password);
  nuxtApp.vueApp.component("Toast", Toast);
  nuxtApp.vueApp.component("Card", Card);
  nuxtApp.vueApp.component("ProgressSpinner", ProgressSpinner);
  nuxtApp.vueApp.component("Menu", Menu);
  nuxtApp.vueApp.component("Badge", Badge);
  nuxtApp.vueApp.directive("badge", BadgeDirective);
});
