import { getUserFromApiKeyMiddleware } from "../utils/middleware";

export default defineEventHandler(async (event) => {
  await getUserFromApiKeyMiddleware(event);

  try {
    return {};
  } catch (e: any) {
    console.log({ e });
    throw createError({
      statusCode: 400,
    });
  }
});
