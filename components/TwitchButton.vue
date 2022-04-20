<template>
  <a class="p-button no-underline" :href="twitchLoginUrl">Login</a>
</template>

<script setup lang="ts">
const { TWITCH_REDIRECT_URL, TWITCH_CLIENT_ID } = useRuntimeConfig();

const queryParams = new URLSearchParams();

queryParams.append("response_type", "code");
queryParams.append("client_id", TWITCH_CLIENT_ID);
queryParams.append("redirect_uri", TWITCH_REDIRECT_URL);
queryParams.append("scope", ["user:read:follows", "user:read:email"].join(" "));

const twitchLoginUrl = `https://id.twitch.tv/oauth2/authorize?${queryParams.toString()}`;
</script>
