import { getUserFromTokenMiddleware } from "../utils/middleware";
import {
  getIncomingRaids,
  getOutgoingRaids,
  Raid,
} from "../repositories/raids";

export default defineEventHandler(async (event) => {
  const user = await getUserFromTokenMiddleware(event);

  try {
    const rawIncomingRaids = await getIncomingRaids(
      user.twitchId,
      user.twitchName
    );

    const rawOutgoingRaids = await getOutgoingRaids(
      user.twitchId,
      user.twitchName
    );

    const incomingRaidCountsSet: Record<string, number> = {};

    const sortedRawIncomingRaids = rawIncomingRaids.sort(
      (a, b) => a.createdAt - b.createdAt
    );

    const sortedRawOutgoingRaids = rawOutgoingRaids.sort(
      (a, b) => a.createdAt - b.createdAt
    );

    const incomingRaidsMap: Record<string, Raid> = {};
    const outgoingRaidsMap: Record<string, Raid> = {};

    sortedRawIncomingRaids.forEach((raid) => {
      incomingRaidsMap[raid.fromTwitchChannel] = raid;
    });

    sortedRawOutgoingRaids.forEach((raid) => {
      outgoingRaidsMap[raid.toTwitchChannel] = raid;
    });

    const incomingRaids = Object.values(incomingRaidsMap).sort(
      (a, b) => b.createdAt - a.createdAt
    );

    const outgoingRaids = Object.values(outgoingRaidsMap).sort(
      (a, b) => a.createdAt - b.createdAt
    );

    return {
      incomingRaids,
      outgoingRaids,
    };
  } catch (e: any) {
    console.log({ e });
    throw createError({
      statusCode: 400,
    });
  }
});
