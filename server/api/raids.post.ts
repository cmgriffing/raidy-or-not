import { createRaid, Raid } from "./../repositories/raids";
import { getUserFromApiKeyMiddleware } from "../utils/middleware";
import { getApiKey, setApiKey } from "../repositories/users";
import { nanoid } from "../utils/nanoid";
import { useBody } from "h3";

export default defineEventHandler(async (event) => {
  const user = await getUserFromApiKeyMiddleware(event);

  console.log({ user });

  try {
    const body: Raid = await useBody(event);

    // validate raid body

    const now = Math.round(Date.now() / 1000);

    const createResult = await createRaid({
      ...body,
      twitchId: user?.twitchId?.trim(),
      createdAt: now,
      modifiedAt: now,
    });

    return {};
  } catch (e: any) {
    console.log({ e });
    throw createError({
      statusCode: 400,
    });
  }
});
