import { defineStore } from "pinia";
import { StoreName } from "~~/types/store";
import { useAxios } from "./original-axios";

export const useAuth = defineStore(StoreName.Auth, {
  state: () => {
    const $axios = useAxios();

    let state = {
      authToken: "",
      twitchToken: "",
    };

    try {
      state = JSON.parse(localStorage.getItem("auth") || "");
    } catch (e: any) {}

    $axios.setAuthToken(state.authToken);
    $axios.setTwitchToken(state.twitchToken);

    return state;
  },
  actions: {
    setAuthToken(token: string) {
      const $axios = useAxios();
      this.authToken = token;
      $axios.setAuthToken(token);
    },
    setTwitchToken(token: string) {
      const $axios = useAxios();
      this.twitchToken = token;
      $axios.setTwitchToken(token);
    },
  },
});
