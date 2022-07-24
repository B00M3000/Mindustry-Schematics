import type { RequestHandler } from '@sveltejs/kit';
import env from '@/server/env';
export const GET: RequestHandler = async () => {
  const params = new URLSearchParams({
    client_id: env.DISCORD_APPLICATION_ID || '',
    scope: 'identify',
    redirect_uri: `${env.WEBSITE_URL}/user/redirect`,
    response_type: 'code',
    prompt: 'none',
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