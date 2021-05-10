import type { Context } from '@/interfaces/app';
import { UserAccess } from '@/lib/auth/access';
import { UserTokenSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler<Context> = async (req) => {
  const access = UserAccess.from(req.context.access);
  if (!access.can({ userTokens: { read: 'all' } }))
    return {
      status: 403,
      headers: {
        location: '/user',
      },
      body: 'Forbidden',
    };
  const users = await UserTokenSchema.find({});
  return {
    status: 200,
    body: users,
  };
};
