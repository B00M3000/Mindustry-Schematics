import { Access, UserAccess } from '@/lib/auth/access';
import type { RequestHandler } from '@sveltejs/kit';
type GetOutput =
  | {
      message: string;
    }
  | {
      token: string;
    };
export const POST: RequestHandler<never, GetOutput> = async (req) => {
  const access = UserAccess.from(req.locals.access);
  if (!access.can({ userTokens: Access.readAll | Access.updateAll }))
    return {
      status: 403,
      headers: {
        location: '/',
      },
      body: {
        message: 'Forbidden',
      },
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
