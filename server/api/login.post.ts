import axios from "axios";
import { createUser, getFullUser } from "../repositories/users";
import { encodeAccessToken } from "../utils/jwt";

export default defineEventHandler(async (event) => {
  try {
    const { code } = await useBody(event);
    const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, TWITCH_REDIRECT_URL } =
      useRuntimeConfig();

    if (!code) {
      throw createError({
        statusCode: 400,
      });
    }

    const twitchResponse = await axios.post(
      "https://id.twitch.tv/oauth2/token",
      {
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        redirect_uri: TWITCH_REDIRECT_URL,
        grant_type: "authorization_code",
        code,
      }
    );

    const userResponse = await axios.get("https://api.twitch.tv/helix/users", {
      headers: {
        Authorization: `Bearer ${twitchResponse.data.access_token}`,
        "Client-Id": TWITCH_CLIENT_ID,
      },
    });

    const { id, login, email } = userResponse.data.data[0];

    let existingUser = await getFullUser(id);
    if (!existingUser?.twitchId) {
      const now = Math.round(Date.now() / 1000);
      existingUser = {
        twitchId: id,
        twitchName: login,
        email,
        createdAt: now,
        modifiedAt: now,
      };
      await createUser(existingUser);
    }

    const authToken = encodeAccessToken(existingUser);

    return {
      authToken: authToken,
      twitchToken: twitchResponse.data.access_token,
    };
  } catch (e: any) {
    console.log({ e });
    throw createError({
      statusCode: 400,
    });
  }
});
