import { error, json } from '@sveltejs/kit';
import { UserSchema, SessionSchema } from '@/server/mongo';
import type { RequestHandler } from './$types';
import env from '@/server/env';

async function get_tokens(code: string) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const data = new URLSearchParams({
    'client_id': env.DISCORD_APPLICATION_ID!,
    'client_secret': env.DISCORD_APPLICATION_SECRET!,
    'grant_type': 'authorization_code',
    'redirect_uri': `${env.WEBSITE_URL}/user/redirect`,
    'scope': 'identify',
    'code': code
  });

  const response = await fetch('https://discordapp.com/api/oauth2/token', {
    method: 'POST',
    body: data as never,
  });
  
  return response.json();
}

async function get_user(token_type: unknown, access_token: unknown) {
  const response = await fetch('https://discordapp.com/api/users/@me', {
    headers: {
      authorization: `${token_type} ${access_token}`,
    },
  });
  const data = await response.json();
  return data;
}

const absolute = new RegExp('^(?:[a-z+]+:)?//', 'i');

export const GET: RequestHandler = async (req) => {
  const code = req.url.searchParams.get('code');
  const redirect = req.url.searchParams.get('state');

  if (!code) throw error(400, 'missing code');

  const data = await get_tokens(code);
  if (!data.access_token) {
    return json(
      {
        message: 'Invalid Authorization Code',
        data,
      },
      {
        status: 307,
        headers: {
          location: '/user/failed',
        },
      },
    );
  }

  const { token_type, access_token } = data;

  const discord_user = await get_user(token_type, access_token);

  const user = await UserSchema.findOneAndUpdate(
    {
      id: discord_user.id,
    },
    {
      id: discord_user.id,
      username: discord_user.username,
      discriminator: discord_user.discriminator,
      discord_id: discord_user.id,
      avatar_url: discord_user.avatar
        ? 'https://cdn.discordapp.com/avatars/' +
          `${discord_user.id}/${discord_user.avatar}.webp`
        : `/assets/discord_default_avatar.png`,
    },
    {
      upsert: true,
      new: true,
    },
  );

  const session = await SessionSchema.create({ user_id: user._id });

  return json(
    {
      message: 'Redirect to User Dashboard',
    },
    {
      status: 307,
      headers: {
        location: redirect ? (absolute.test(redirect) ? '/user' : redirect) : '/user',
        'set-cookie': req.cookies.serialize('session_id', session._id.toString(), {
          path: '/',
        }),
      },
    },
  );
};
