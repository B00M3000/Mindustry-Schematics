import type { RequestHandler } from '@sveltejs/kit';
import { SessionSchema } from '@/server/mongo';
import * as cookie from 'cookie';
export const post: RequestHandler = async (req) => {
  const deleted = await SessionSchema.deleteOne({ _id: req.locals.session_id });

  if(!deleted){
    return {
    status: 200,
    headers: {
      'set-cookie': cookie.serialize('session_id', '', {
        path: '/',
      }),
    },
    body: {
      message: 'Invalid or Expired Session ID. Session Cookies removed, no session data base not altered.',
    },
  };
  }
  
  return {
    status: 200,
    headers: {
      'set-cookie': cookie.serialize('session_id', '', {
        path: '/',
      }),
    },
    body: {
      message: 'Logged out Successfully!',
    },
  };
};
