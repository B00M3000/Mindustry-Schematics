import { SchematicSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';
import { DISCORD_APPLICATION_ID, WEBSITE_URL } from '@/server/env';

export const get: RequestHandler = async (req) => {
  
  return {
    status: 308,
    headers: {
      location: `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_APPLICATION_ID}?scope=identify?redirect=${WEBSITE_URL}/user/discord/redirect`
    },
    body: {
      message: "Redirect to Discord Oauth"
    }
  };
};
