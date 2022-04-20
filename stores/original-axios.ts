import { defineStore } from "pinia";
import { StoreName } from "~~/types/store";
import Axios, { AxiosInstance, AxiosError } from "axios";

const defaultConfig = { baseURL: "/api" };
const defaultTwitchConfig = { baseURL: "https://api.twitch.tv" };

export const useAxios = defineStore(StoreName.Axios, {
  state: () => {
    return {
      unauthenticated: Axios.create(defaultConfig),
      authenticated: Axios.create(defaultConfig),
      twitch: Axios.create(defaultTwitchConfig),
      external: Axios.create(),
    };
  },
  getters: {
    getAxios: (state) => {
      return state.unauthenticated;
    },
  },
  actions: {
    setAuthToken(token: string) {
      const newAxios = Axios.create(defaultConfig);
      const router = useRouter();

      console.log("setting token for authenticated axios", token);

      newAxios.interceptors.request.use(function (request) {
        request.headers = {
          Authorization: `Bearer ${token}`,
        };

        return request;
      });

      newAxios.interceptors.response.use(
        function (response) {
          return response;
        },
        function (error: AxiosError) {
          if (!error.response || error.response?.status === 401) {
            router.push("/logged-out");
          }
        }
      );

      this.authenticated = newAxios;
    },
    setTwitchToken(token: string) {
      const newAxios = Axios.create(defaultTwitchConfig);
      const router = useRouter();
      const { TWITCH_CLIENT_ID } = useRuntimeConfig();

      newAxios.interceptors.request.use(function (request) {
        request.headers = {
          Authorization: `Bearer ${token}`,
          "Client-ID": TWITCH_CLIENT_ID,
        };
        return request;
      });

      newAxios.interceptors.response.use(
        function (response) {
          return response;
        },
        function (error: AxiosError) {
          if (!error.response || error.response?.status === 401) {
            router.push("/logged-out");
          }
        }
      );

      this.twitch = newAxios;
    },
  },
});
