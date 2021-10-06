import type { Locals } from '@/interfaces/app';
import { Access, UserAccess } from '@/lib/auth/access';
import { UserTokenSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler<Locals> = async (req) => {
  const access = UserAccess.from(req.locals.access);
  if (!access.can({ userTokens: Access.readAll }))
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
    body: users as never,
  };
};
