<template>
  <Toast position="bottom-center" />
  <div class="py-10">
    <div
      class="w-full items-center flex flex-column justify-content-center py-4"
    >
      <Card>
        <template #title>
          <h2>Recommendations</h2>
        </template>
        <template #content>
          <p class="pb-4" v-if="recommendedChannels?.length">
            Select a channel to copy the raid command to your clipboard.
          </p>

          <div
            class="flex flex-row items-center justify-content-center"
            v-if="recommendedChannels?.length"
          >
            <button
              class="block text-center"
              v-for="channel in recommendedChannels?.slice(0, 4)"
              @click="copyRaidCommand(channel)"
            >
              <img
                :src="streamsMap[channel].thumbnail_url"
                :alt="`Image preview for ${channel}`"
              />
              <div class="flex flex-row items-center justify-content-center">
                <span class="block text-2xl mr-2">
                  {{ channel }}
                </span>
                <Badge v-if="channelScoresMap[channel] < 0" severity="danger">{{
                  channelScoresMap[channel]
                }}</Badge>
                <Badge v-if="channelScoresMap[channel] === 0" severity="info">{{
                  channelScoresMap[channel]
                }}</Badge>
                <Badge
                  v-if="channelScoresMap[channel] > 0"
                  severity="success"
                  >{{ channelScoresMap[channel] }}</Badge
                >
              </div>
            </button>
          </div>

          <p v-if="!recommendedChannels?.length">
            No recommended channels at this time.
          </p>
        </template>
      </Card>
    </div>

    <div class="w-full flex flex-row justify-content-center">
      <div class="px-2">
        <Card class="h-full">
          <template #title>
            <div class="flex flex-row">
              <h2>API Key</h2>
              <div class="flex-1"></div>
              <Button
                type="button"
                class="p-button-rounded p-button-text p-button-plain"
                icon="pi pi-ellipsis-v"
                @click="toggleApiKeyMenu"
              />
              <Menu
                ref="resetApiKeyMenu"
                :model="resetApiKeyMenuItems"
                :popup="true"
              />
            </div>
          </template>
          <template #content>
            <div class="w-80">
              <p class="">You will use this key when running the bot.</p>
              <p class="">
                It can be reset using the menu at the top of this card.
              </p>
            </div>
            <div
              class="flex-row items-center justify-content-center text-center mt-4"
            >
              <label class="sr-only">API Key </label>
              <div class="p-inputgroup flex-1">
                <Password
                  :value="apiKey"
                  :feedback="false"
                  :toggleMask="true"
                  @focus="
                  (event) => {
                    (event.currentTarget as HTMLInputElement)?.select();

                    toast.add({
                      severity: 'success',
                      summary: 'API Key copied',
                      life: 3000,
                    });

                  }
                "
                  readonly
                />

                <Button class="p-inputgroup-addon" @click="copyHandler">
                  Copy
                </Button>
              </div>
            </div>
          </template>
        </Card>
      </div>
      <div class="px-2">
        <Card class="h-full">
          <template #title>Bot</template>
          <template #content>
            <p class="w-80 mb-3">
              To track incoming and outgoing raids, you will need to have a bot
              running on your machine. You can get it here:
            </p>

            <div class="flex flex-row items-center justify-content-center">
              <template v-for="icon in downloadIcons">
                <NuxtLink
                  :to="icon.link"
                  download
                  class="text-center mx-2 w-20 inline-block bg-[color:var(--primary-color)] rounded p-2 active:opacity-70"
                >
                  <img
                    :src="icon.image"
                    height="40"
                    width="40"
                    :alt="`${icon.label} Icon`"
                    class="mx-auto invert"
                  />
                  <span>{{ icon.label }}</span>
                </NuxtLink>
              </template>
            </div>

            <p class="p-2">
              You can also see the latest releases on
              <NuxtLink
                to="https://github.com/cmgriffing/raidy-or-not-bot/releases"
                >Github</NuxtLink
              >
            </p>
          </template>
        </Card>
      </div>
    </div>

    <div v-if="raids?.incomingRaids?.length || raids?.outgoingRaids?.length">
      <h2 class="text-center text-2xl font-bold my-4">History</h2>
      <div class="flex flex-row justify-content-center">
        <div class="incoming-raids px-2">
          <Card class="h-full">
            <template #title>
              <h2 class="text-xl font-bold">Incoming</h2>
            </template>
            <template #content>
              <ol>
                <li
                  class="flex flex-row p-1 relative"
                  v-for="raid in raids?.incomingRaids"
                >
                  <span
                    v-if="streamsMap[raid.fromTwitchChannel]?.type === 'live'"
                    class="live-dot absolute left-[-12px] top-[12px]"
                  ></span>
                  <span class="pr-8">
                    {{ raid.fromTwitchChannel }}
                  </span>
                  <span class="flex-1"></span>
                  {{ dayjs(raid.createdAt * 1000).fromNow() }}
                </li>
              </ol>
            </template>
          </Card>
        </div>
        <div class="outgoing-raids px-2">
          <Card class="h-full">
            <template #title>
              <h2 class="text-xl font-bold">Outgoing</h2>
            </template>
            <template #content>
              <ol>
                <li
                  class="p-1 flex flex-row relative"
                  v-for="raid in raids.outgoingRaids"
                >
                  <span
                    v-if="streamsMap[raid.toTwitchChannel]?.type === 'live'"
                    class="live-dot absolute left-[-12px] top-[12px]"
                  ></span>
                  <span class="pr-8">
                    {{ raid.toTwitchChannel }}
                  </span>
                  <span class="flex-1"></span>
                  {{ dayjs(raid.createdAt * 1000).fromNow() }}
                </li>
              </ol>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuth } from "@/stores/auth";
import { useAxios } from "@/stores/axios";
import { ApiPath } from "@/types/api";
import { Raid } from "@/server/repositories/raids";
import { User } from "@/server/repositories/users";
import jwtDecode from "jwt-decode";
import WindowsIcon from "@/assets/windows.svg";
import MacosIcon from "@/assets/macos.svg";
import LinuxIcon from "@/assets/linux.svg";
import { Release } from "@/types/github";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const { data: releasesData } = await useFetch(
  "https://api.github.com/repos/cmgriffing/raidy-or-not-bot/releases"
);

const releases = releasesData.value as unknown as Release[];

const [linuxRelease, macRelease, windowsRelease] = [
  ".AppImage",
  ".dmg",
  ".exe",
].map((extension) => {
  return releases[0].assets.find(
    (asset) =>
      asset.browser_download_url.indexOf(extension) ===
      asset.browser_download_url?.length - extension.length
  )?.browser_download_url;
});

const $auth = useAuth();
const $axios = useAxios();
const toast = useToast();

const apiKey = ref("");
const raids = ref({ incomingRaids: [] as Raid[], outgoingRaids: [] as Raid[] });
const channelScoresMap = ref({} as Record<string, number>);

const downloadIcons = [
  { image: WindowsIcon, label: "Windows", link: windowsRelease },
  { image: MacosIcon, label: "MacOS", link: macRelease },
  { image: LinuxIcon, label: "Linux", link: linuxRelease },
];

const streamsMap = ref({} as Record<string, TwitchStream>);
const channelNames = ref([] as string[]);
const recommendedChannels = ref([] as string[]);

const copyHandler = async function () {
  await navigator.clipboard.writeText(apiKey.value);

  toast.add({
    severity: "success",
    summary: "API Key copied",
    life: 3000,
  });
};

const copyRaidCommand = (channelName: string) => {
  navigator.clipboard.writeText(`/raid ${channelName}`);

  toast.add({
    severity: "success",
    summary: "Raid command copied",
    life: 3000,
  });
};

const resetApiKeyMenuItems = [
  {
    label: "Reset API Key",
    icon: "pi pi-refresh",
    command: async () => {
      await resetApiKey();
      toast.add({
        severity: "success",
        summary: "API Key reset",
        life: 3000,
      });
    },
  },
];

const resetApiKeyMenu = ref(null as unknown as Menu);

async function resetApiKey() {
  const apiKeyResponse = await $axios.authenticated.post("/api-key");

  apiKey.value = apiKeyResponse.data.apiKey;
}

function toggleApiKeyMenu(event: any) {
  resetApiKeyMenu.value.toggle(event);
}

onMounted(async () => {
  const router = useRouter();

  console.log("auth token", $auth.authToken);

  if (!$auth.authToken) {
    router.push("/logged-out");
    return;
  }

  const decoded = jwtDecode($auth.authToken) as { sub: { user: User } };
  const user = decoded.sub.user;

  const [apiKeyResponse, raidsResponse] = await Promise.all([
    $axios.authenticated.get(ApiPath.ApiKey),
    $axios.authenticated.get(ApiPath.Raids),
  ]);

  console.log("Api Key Response", apiKeyResponse.data);
  console.log("Raids Response", raidsResponse.data);

  apiKey.value = apiKeyResponse.data.apiKey;
  raids.value = raidsResponse.data as {
    incomingRaids: Raid[];
    outgoingRaids: Raid[];
  };

  const channelNamesSet = new Set<string>();

  const newChannelScoresMap: Record<string, number> = {};

  raids.value.incomingRaids.forEach((raid) => {
    if (!newChannelScoresMap[raid.fromTwitchChannel]) {
      newChannelScoresMap[raid.fromTwitchChannel] = 1;
    } else {
      newChannelScoresMap[raid.fromTwitchChannel] += 1;
    }
  });

  raids.value.outgoingRaids.forEach((raid) => {
    if (!newChannelScoresMap[raid.toTwitchChannel]) {
      newChannelScoresMap[raid.toTwitchChannel] = -1;
    } else {
      newChannelScoresMap[raid.toTwitchChannel] -= 1;
    }
  });

  channelScoresMap.value = newChannelScoresMap;

  [...raids.value.incomingRaids, ...raids.value.outgoingRaids].forEach(
    (raid) => {
      channelNamesSet.add(raid.toTwitchChannel);
      channelNamesSet.add(raid.fromTwitchChannel);
    }
  );

  channelNamesSet.delete(user.twitchName);

  const newChannelNames = Array.from(channelNamesSet);

  const batches = [];

  let sliced = newChannelNames.slice(0, 99);
  batches.push(sliced);
  let remainder = newChannelNames.slice(100);
  while (remainder?.length) {
    sliced = remainder.slice(0, 99);
    batches.push(sliced);
    remainder = remainder.slice(100);
  }

  const fetchedBatches = (
    await Promise.all(
      batches.map((batch) => {
        const joined = batch
          .map((streamName) => `user_login=${streamName}`)
          .join("&");
        return $axios.twitch.get(
          `https://api.twitch.tv/helix/streams?${joined}`
        );
      })
    )
  ).map((response) =>
    response.data.data.map((channel: TwitchStream) => {
      channel.thumbnail_url = channel.thumbnail_url
        .replace("{width}", "200")
        .replace("{height}", Math.round((200 / 16) * 9) + "");

      return channel;
    })
  );

  console.log({ fetchedBatches });

  const streams: TwitchStream[] = [];
  fetchedBatches.forEach((fetchedBatch) => {
    streams.push(...fetchedBatch);
  });

  const newStreamsMap: Record<string, TwitchStream> = {};
  streams.forEach((stream) => {
    newStreamsMap[stream.user_login] = stream;
  });

  console.log({ newStreamsMap });

  streamsMap.value = newStreamsMap;

  channelNames.value = newChannelNames;

  recommendedChannels.value = newChannelNames
    .filter((channel) => {
      console.log("channel type", channel, newStreamsMap[channel]?.type);
      return newStreamsMap[channel]?.type === "live";
    })
    .sort((channelA, channelB) => {
      const channelAScore = newChannelScoresMap[channelA] || 0;
      const channelBScore = newChannelScoresMap[channelB] || 0;

      return channelAScore - channelBScore;
    });
});
</script>

<style>
.live-dot {
  display: inline-block;
  background: red;
  height: 10px;
  width: 10px;
  border-radius: 100%;
}
</style>
