import { User } from "./../repositories/users";
import { getApiKey, getUser, getUserByApiKey } from "../repositories/users";
import { decodeToken } from "./jwt";
import { CompatibilityEvent } from "h3";

export async function getUserFromTokenMiddleware(event: CompatibilityEvent) {
  try {
    const authHeader: string = event.req?.headers?.authorization as string;
    const token = authHeader.replace("Bearer ", "");

    const {
      sub: {
        user: { twitchId },
      },
    } = decodeToken(token) as any;

    if (!twitchId) {
      throw new Error("Token did not contain twitchId");
    }

    const user = await getUser(twitchId);

    if (!user?.twitchId) {
      throw new Error(`User with twitchId (${twitchId}) does not exist`);
    }

    return user;
  } catch (error) {
    console.log({ error });
    throw createError({
      statusCode: 401,
    });
  }
}

export async function getUserFromApiKeyMiddleware(event: CompatibilityEvent) {
  try {
    const authHeader: string = event.req?.headers?.authorization as string;
    const apiKey = authHeader.replace("ApiKey ", "");

    const user: User = await getUserByApiKey(apiKey);

    return user;
  } catch (error) {
    console.log({ error });
    throw createError({
      statusCode: 401,
    });
  }
}
