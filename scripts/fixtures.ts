import { Raid, createRaid } from "./../server/repositories/raids";

const secondsPerDay = 60 * 60 * 24;
const twoWeeks = secondsPerDay * 14;

async function main() {
  const streamers = [
    { channelName: "jonbonjovi" },
    { channelName: "85filter" },
    { channelName: "burnttoast_jpeg" },
    { channelName: "hydr0h_" },
    { channelName: "marky_gee" },
    { channelName: "mrbankster" },
    { channelName: "b1mind" },
    { channelName: "cryptslive" },
    { channelName: "cmgriffing" },
  ];

  new Array(100).fill("").forEach(async () => {
    const randomStreamerIndex = Math.floor(Math.random() * streamers.length);
    const streamer = streamers[randomStreamerIndex];

    const isIncoming = !!Math.round(Math.random());

    const raidTime =
      Math.round(Date.now() / 1000) - Math.round(Math.random() * twoWeeks);

    await createRaid({
      twitchId: "433913815",
      toTwitchChannel: isIncoming ? streamer.channelName : "styrofoam_pad",
      fromTwitchChannel: isIncoming ? "styrofoam_pad" : streamer.channelName,
      raidAmount: 42,
      createdAt: raidTime,
      modifiedAt: raidTime,
    });
  });
}

main();
