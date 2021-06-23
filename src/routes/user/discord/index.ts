import type { RequestHandler } from '@sveltejs/kit';
import env from '@/server/env';
export const get: RequestHandler = async () => {
  const params = new URLSearchParams({
    client_id: env.DISCORD_APPLICATION_ID || '',
    scope: 'identify',
    redirect: `${env.WEBSITE_URL}/user/discord/redirect`,
    response_type: 'code',
    prompt: 'none'
  });
  return {
    status: 308,
    headers: {
      location: `https://discord.com/api/oauth2/authorize?${params}`,
    },
    body: {
      message: 'Redirect to Discord Oauth',
    },
  };
};
