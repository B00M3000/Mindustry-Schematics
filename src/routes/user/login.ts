import type { RequestHandler } from '@sveltejs/kit';
import env from '@/server/env';
export const GET: RequestHandler = async () => {
  const redirect_url = new URL('/user/redirect', env.WEBSITE_URL);

  const params = new URLSearchParams({
    client_id: env.DISCORD_APPLICATION_ID!,
    scope: 'identify guilds.join',
    redirect_uri: redirect_url.toString(),
    response_type: 'code',
    //prompt: 'none',
  });

  return {
    status: 307,
    headers: {
      location: `https://discord.com/api/oauth2/authorize?${params}`,
    },
    body: {
      message: 'Redirect to Discord Oauth',
      location: `https://discord.com/api/oauth2/authorize?${params}`,
    },
  };
};
