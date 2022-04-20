import { getUserFromTokenMiddleware } from "../utils/middleware";
import { getApiKey, setApiKey } from "../repositories/users";
import { nanoid } from "../utils/nanoid";

export default defineEventHandler(async (event) => {
  const user = await getUserFromTokenMiddleware(event);

  try {
    const apiKey = nanoid();

    await setApiKey(user.twitchId, apiKey);

    return {
      apiKey,
    };
  } catch (e: any) {
    console.log({ e });
    throw createError({
      statusCode: 400,
    });
  }
});
