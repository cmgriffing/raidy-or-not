import { defineStore } from "pinia";
import { StoreName } from "~~/types/store";

export const useAuth = defineStore(StoreName.Auth, {
  state: () => {
    let state = {
      authToken: "",
      twitchToken: "",
    };

    try {
      state = JSON.parse(localStorage.getItem("auth") || "");
    } catch (e: any) {}

    return state;
  },
  actions: {
    setAuthToken(token: string) {
      this.authToken = token;
    },
    setTwitchToken(token: string) {
      this.twitchToken = token;
    },
  },
});
