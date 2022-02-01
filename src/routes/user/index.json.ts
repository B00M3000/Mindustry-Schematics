import type { RequestHandler } from '@sveltejs/kit';
import { SessionSchema } from '@/server/mongo';
import { ServerSession } from '@/server/auth/session';
import * as cookie from 'cookie';
export const get: RequestHandler = async (req) => {
  const session = await ServerSession.get(req.locals.session_id);

  if(!session){
    return {
      status: 404,
      body: {
        message: "Expired or Invalid Session ID. Please try logging in again before retrying."
      },
    };
  }
  
  return {
    status: 200,
    body: {
      user: session.user
    },
  };
};
