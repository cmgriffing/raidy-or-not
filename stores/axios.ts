import { useAuth } from "./original-auth";
import { defineStore } from "pinia";
import { StoreName } from "~~/types/store";
import Axios, { AxiosInstance, AxiosError } from "axios";

const defaultConfig = { baseURL: "/api" };
const defaultTwitchConfig = { baseURL: "https://api.twitch.tv" };

export const useAxios = defineStore(StoreName.Axios, {
  state: () => {
    return {
      unauthenticated: Axios.create(defaultConfig),
      // _authenticated: Axios.create(defaultConfig),
      // _twitch: Axios.create(defaultTwitchConfig),
      external: Axios.create(),
    };
  },
  getters: {
    authenticated: (state) => {
      const $auth = useAuth();

      const newAxios = Axios.create(defaultConfig);
      const router = useRouter();

      console.log("setting token for authenticated axios", $auth.authToken);

      newAxios.interceptors.request.use(function (request) {
        request.headers = {
          Authorization: `Bearer ${$auth.authToken}`,
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

      return newAxios;
    },
    twitch(state) {
      const $auth = useAuth();

      const newAxios = Axios.create(defaultTwitchConfig);
      const router = useRouter();
      const { TWITCH_CLIENT_ID } = useRuntimeConfig();

      newAxios.interceptors.request.use(function (request) {
        request.headers = {
          Authorization: `Bearer ${$auth.twitchToken}`,
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

      return newAxios;
    },
  },
});
