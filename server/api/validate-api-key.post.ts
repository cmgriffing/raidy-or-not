import { getUserFromApiKeyMiddleware } from "../utils/middleware";

export default defineEventHandler(async (event) => {
  console.log("validating api key");

  await getUserFromApiKeyMiddleware(event);

  console.log("api key is valid");

  try {
    return {};
  } catch (e: any) {
    console.log({ e });
    throw createError({
      statusCode: 400,
    });
  }
});
