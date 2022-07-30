import { UserSchema, SessionSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';
import env from '@/server/env';
import * as cookie from 'cookie';

async function get_tokens(code: string) {
  const data = new URLSearchParams();
  data.append('client_id', env.DISCORD_APPLICATION_ID!);
  data.append('client_secret', env.DISCORD_APPLICATION_SECRET!);
  data.append('grant_type', 'authorization_code');
  data.append('redirect_uri', `${env.WEBSITE_URL}/user/redirect`);
  data.append('scope', 'identify');
  data.append('code', code);

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

export const GET: RequestHandler = async (req) => {
  const code = req.url.searchParams.get('code');

  if (!code)
    return {
      status: 400,
      body: {
        message: 'missing code',
      },
    };

  const data = await get_tokens(code);
  if (!data.access_token) {
    return {
      status: 308,
      headers: {
        location: '/user/failed',
      } as never, // fix for type error generated by differing headers
      body: {
        message: 'Invalid Authorization Code',
        data,
      } as never,
    };
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

  return {
    status: 308,
    headers: {
      location: '/user',
      'set-cookie': cookie.serialize('session_id', session._id, {
        path: '/',
      }),
    },
    body: {
      message: 'Redirect to User Dashboard',
    },
  };
};

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
