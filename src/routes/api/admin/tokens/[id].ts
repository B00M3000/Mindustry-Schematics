import type { Context } from '@/interfaces/app';
import { UserAccess } from '@/lib/auth/access';
import { UserTokenSchema } from '@/server/mongo';
import { parseForm } from '@/server/parse_body';
import type { RequestHandler } from '@sveltejs/kit';
import * as cookie from 'cookie';
interface Data {
  username: string;
  token: string;
  access: string;
}
export const post: RequestHandler<Context> = async (req) => {
  const currentAccess = UserAccess.from(req.context.access);
  if (!currentAccess.can({ schematics: ['update'] }))
    return {
      status: 403,
      headers: {
        location: '/',
      },
      body: 'Forbidden',
    };

  const { username, token, access } = parseForm<Data>(req.body);
  if (!(username && token && access))
    return {
      status: 400,
      body: 'Missing required fields',
    };
  await UserTokenSchema.findOneAndUpdate(
    {
      token: req.params.id,
    },
    {
      username,
      token,
      access,
    },
    {
      upsert: true,
    },
  );
  const headers: Record<string, string> = {};
  if (req.context.token == req.params.id)
    headers['set-cookie'] = cookie.serialize('token', token, {
      path: '/',
    });
  return {
    status: 200,
    headers,
    body: 'Ok',
  };
};
export const del: RequestHandler<Context> = async (req) => {
  const access = UserAccess.from(req.context.access);
  if (!access.can({ schematics: ['delete'] }))
    return {
      status: 403,
      headers: {
        location: '/',
      },
      body: 'Forbidden',
    };

  const _token = req.params.id;
  await UserTokenSchema.deleteOne({
    token: _token,
  });
  const headers: Record<string, string> = {};
  if (req.params.id == req.context.token)
    headers['set-cookie'] = cookie.serialize('token', '', {
      path: '/',
    });
  return {
    status: 200,
    headers,
    body: 'Token deleted',
  };
};
