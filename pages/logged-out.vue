<template>
  <div class="flex items-center justify-content-center flex-1">
    <Card class="mt-8">
      <template #title>
        <h2>You have been logged out.</h2>
      </template>
      <template #content>
        <div class="text-center">
          <p class="mb-4">
            If you would like to log in again, click the button below
          </p>
          <TwitchButton />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuth } from "@/stores/auth";
import TwitchButton from "~~/components/TwitchButton.vue";

const $auth = useAuth();

onMounted(async () => {
  $auth.setAuthToken("");
  $auth.setTwitchToken("");
});
</script>
