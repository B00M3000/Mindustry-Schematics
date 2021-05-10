import type { Context } from '@/interfaces/app';
import { UserAccess } from '@/lib/auth/access';
import type { RequestHandler } from '@sveltejs/kit';
export const post: RequestHandler<Context> = async (req) => {
  const access = UserAccess.from(req.context.access);
  if (!access.can({ userTokens: { read: 'all', update: 'all' } }))
    return {
      status: 403,
      headers: {
        location: '/',
      },
      body: 'Forbidden',
    };
  // TODO: replace this with uuid
  const preffix = new Date().getTime().toString(36);
  const suffix = Math.floor(Math.random() * 100000).toString(36);
  const token = preffix + suffix;
  return {
    status: 200,
    body: {
      token,
    },
  };
};
