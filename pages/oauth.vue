<template>
  <div>
    <h2 class="text-6xl font-bold text-center mt-40">Logging in...</h2>
    <div class="text-center mt-4">
      <ProgressSpinner
        strokeWidth="20"
        fill="var(--surface-ground)"
        class="mx-auto"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuth } from "@/stores/auth";
import { useAxios } from "@/stores/axios";
import { ApiPath } from "@/types/api";

const router = useRouter();

// lifecycle hooks
onMounted(async () => {
  const $auth = useAuth();
  const $axios = useAxios();
  const queryParams = new URLSearchParams(window.location.search);

  const loginResponse = await $axios.unauthenticated.post(ApiPath.Login, {
    code: queryParams.get("code") || "",
  });

  const { authToken, twitchToken } = loginResponse.data;

  $auth.setAuthToken(authToken);
  $auth.setTwitchToken(twitchToken);

  setTimeout(() => {
    router.push("/dashboard");
  }, 3000);
});
</script>
