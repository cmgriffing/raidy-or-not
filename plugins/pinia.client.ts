import { createPersistedStatePlugin } from "pinia-plugin-persistedstate-2";
import { defineNuxtPlugin } from "#app";
import {
  PiniaPluginContext,
  StateTree,
  _GettersTree,
  _ActionsTree,
} from "pinia";
import { StoreName } from "~~/types/store";

export default defineNuxtPlugin(({ $pinia }) => {
  const installPersistedStatePlugin = createPersistedStatePlugin();
  $pinia.use(
    (
      context: PiniaPluginContext<
        string,
        StateTree,
        _GettersTree<StateTree>,
        _ActionsTree
      >
    ) => {
      if ([StoreName.Auth].indexOf(context.store.$id as StoreName) > -1) {
        return installPersistedStatePlugin(context);
      }
    }
  );
});
