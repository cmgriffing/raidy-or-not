import { getUserFromTokenMiddleware } from "../utils/middleware";
import { getApiKey } from "../repositories/users";

export default defineEventHandler(async (event) => {
  const user = await getUserFromTokenMiddleware(event);

  try {
    const apiKey = await getApiKey(user.twitchId);

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
