import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import env from '@/server/env';
export const GET: RequestHandler = async ({ url }) => {
  const redirect = url.searchParams.get('redirect');
  const client_id = env.DISCORD_APPLICATION_ID;
  if (!client_id) throw error(500, "The server doesn't have a discord application ID");
  const params = new URLSearchParams({
    client_id,
    scope: 'identify',
    redirect_uri: `${env.WEBSITE_URL}/user/redirect`,
    response_type: 'code',
    prompt: 'none',
  });

  if (redirect) params.append('state', redirect);

  return json(
    {
      message: 'Redirect to Discord Oauth',
    },
    {
      status: 307,
      headers: {
        location: `https://discord.com/api/oauth2/authorize?${params}`,
      },
    },
  );
};
