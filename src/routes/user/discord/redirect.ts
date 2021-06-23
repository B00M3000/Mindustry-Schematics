import fetch from 'node-fetch';
import FormData from 'form-data';

import { UserSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';
import env from '@/server/env';
import * as cookie from 'cookie';

async function get_tokens(code: string | null) {
  const data = new FormData();
  data.append('client_id', env.DISCORD_APPLICATION_ID);
  data.append('client_secret', env.DISCORD_APPLICATION_SECRET);
  data.append('grant_type', 'authorization_code');
  data.append('redirect_uri', `${env.WEBSITE_URL}/login/callback`);
  data.append('scope', 'identify');
  data.append('code', code);

  const response = await fetch('https://discordapp.com/api/oauth2/token', {
    method: 'POST',
    body: data,
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

export const get: RequestHandler = async (req) => {
  const code = req.query.get('code');

  const data = await get_tokens(code);
  if (!data.access_token) {
    return {
      status: 308,
      headers: {
        location: '/user/discord/failed',
      } as never, // fix for type error generated by differing headers
      body: {
        message: 'Invalid Authorization Code',
      },
    };
  }

  const { token_type, access_token } = data;

  const user = await get_user(token_type, access_token);

  const result = await UserSchema.findOneAndUpdate(
    {
      id: user.id,
    },
    {
      id: user.id,
      username: user.username,
      discriminator: user.discriminator,
      avatar_hash: user.avatar,
      avatar_url: user.avatar ? `/avatars/${user.id}/${user.avatar}.png` : `/embed/avatars/${user.discriminator}.png`,
      tag: `${user.username}#${user.discriminator}`
    },
    {
      upsert: true,
      new: true,
    },
  );

  return {
    status: 308,
    headers: {
      location: '/user',
      'set-cookie': cookie.serialize('uid', result._id),
    },
    body: {
      message: 'Redirect to User Dashboard',
    },
  };
};
