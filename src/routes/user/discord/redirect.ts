import fetch from 'node-fetch';
import FormData from 'form-data';

import { DiscordSchema, UserSchema, SessionSchema } from '@/server/mongo';
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

  const discord_user = await get_user(token_type, access_token);

  const discord = await DiscordSchema.findOneAndUpdate(
    {
      id: discord_user.id,
    },
    {
      id: discord_user.id,
      username: discord_user.username,
      discriminator: discord_user.discriminator,
      avatar_hash: discord_user.avatar,
      avatar_url: discord_user.avatar
        ? `/avatars/${discord_user.id}/${discord_user.avatar}.png`
        : `/embed/avatars/${discord_user.discriminator}.png`,
      tag: `${discord_user.username}#${discord_user.discriminator}`,
    },
    {
      upsert: true,
      new: true,
    },
  );

  const user = await UserSchema.findOneAndUpdate(
    {
      discord_id: discord_user.id
    }, {
      discord_id: discord_user.id,
      username: discord_user.username
    }, {
      upsert: true,
      new: true,
    }
  );

  let session = new SessionSchema({ user_id: user.id })

  session = session.save()

  return {
    status: 308,
    headers: {
      location: '/user',
      'set-cookie': cookie.serialize('session_id', session.id, {
        path: '/',
      }),
    },
    body: {
      message: 'Redirect to User Dashboard',
    },
  };
};
