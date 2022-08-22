import type { RequestHandler } from '@sveltejs/kit';
import env from '@/server/env';
export const GET: RequestHandler = async ({ url }) => {
  const redirect = url.searchParams.get('redirect')
  const params = new URLSearchParams({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    client_id: env.DISCORD_APPLICATION_ID!,
    scope: 'identify',
    redirect_uri: `${env.WEBSITE_URL}/user/redirect`,
    response_type: 'code',
    prompt: 'none',
    state: redirect!
  });

  return {
    status: 307,
    headers: {
      location: `https://discord.com/api/oauth2/authorize?${params}`,
    },
    body: {
      message: 'Redirect to Discord Oauth',
    },
  };
};
