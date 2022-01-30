import type { RequestHandler } from '@sveltejs/kit';
import { SessionSchema } from '@/server/mongo';
import * as cookie from 'cookie';
export const post: RequestHandler = (req) => {

  const sucess = await SessionSchema.deleteOne({ _id: req.locals.session_id })

  return {
    status: 308,
    headers: {
      location: '/user',
      'set-cookie': cookie.serialize('session_id', '', {
        path: '/',
      }),
    },
    body: {
      message: 'Logged out Successfully!',
    },
  };
};
