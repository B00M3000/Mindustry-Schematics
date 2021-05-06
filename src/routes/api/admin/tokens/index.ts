import type { Context } from '@/interfaces/app';
import { UserTokenSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler<Context> = async (req) => {
  if (!req.context.isAdmin)
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
