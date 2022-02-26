import { Access, UserAccess } from '@/lib/auth/access';
import { UserTokenSchema } from '@/server/mongo';
import { parseForm } from '@/server/parse_body';
import type { RequestHandler } from '@sveltejs/kit';
import * as cookie from 'cookie';

interface Params {
  id: string;
}
interface Data {
  username: string;
  token: string;
  access: string;
}
type PostOutput = { message: string } | { error: string };
export const post: RequestHandler<Params, PostOutput> = async ({
  locals,
  request,
  params,
}) => {
  const currentAccess = UserAccess.from(locals.access);
  if (!currentAccess.can({ schematics: Access.updateAll }))
    return {
      status: 403,
      headers: {
        location: '/',
      },
      body: { error: 'Forbidden' },
    };

  const { username, token, access } = parseForm<Data>(await request.json());
  if (!(username && token && access))
    return {
      status: 400,
      body: {
        error: 'Missing required fields',
      },
    };
  await UserTokenSchema.findOneAndUpdate(
    {
      token: params.id,
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
  if (locals.token == params.id)
    headers['set-cookie'] = cookie.serialize('token', token, {
      path: '/',
    });
  return {
    status: 200,
    headers,
    body: { message: 'Ok' },
  };
};
type DelOutput = { message: string } | { error: string };
export const del: RequestHandler<Params, DelOutput> = async (req) => {
  const access = UserAccess.from(req.locals.access);
  if (!access.can({ schematics: Access.deleteAll }))
    return {
      status: 403,
      headers: {
        location: '/',
      },
      body: { error: 'Forbidden' },
    };

  const _token = req.params.id;
  await UserTokenSchema.deleteOne({
    token: _token,
  });
  const headers: Record<string, string> = {};
  if (req.params.id == req.locals.token)
    headers['set-cookie'] = cookie.serialize('token', '', {
      path: '/',
    });
  return {
    status: 200,
    headers,
    body: { message: 'Token deleted' },
  };
};
