<template>
  <div class="bg-[color:var(--surface-a)]">
    <Container>
      <header class="flex flex-row items-center p-2">
        <NuxtLink
          :to="isLoggedIn ? '/dashboard' : '/'"
          class="text-primary no-underline text-xl flex flex-row items-center font-bold"
        >
          <img
            alt="light bulb icon"
            :src="lightBulbImage"
            height="40"
            width="40"
          />
          Raidy or Not
        </NuxtLink>
        <div class="flex flex-1"></div>
        <TwitchButton v-if="!isLoggedIn" />
        <NuxtLink
          class="p-button no-underline"
          to="/logged-out"
          v-if="isLoggedIn"
        >
          Logout
        </NuxtLink>
      </header>
    </Container>
  </div>
  <Container>
    <main class="p-2">
      <NuxtPage />
    </main>
  </Container>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuth } from "./stores/auth";
import TwitchButton from "./components/TwitchButton.vue";
import Container from "./components/Container.vue";
import lightBulbImage from "./assets/light-bulb.svg";

const $auth = useAuth();
const isLoggedIn = computed(() => !!$auth.authToken);
</script>
