import cookie from 'cookie';
import type { GetSession, Handle } from '@sveltejs/kit';
import mongo from '@/server/mongo';
import { SessionSchema, UserSchema } from './server/mongo';
import webhooks from './server/webhooks';
import { dev } from '$app/env';
import { User } from './server/auth/user';

const dbPromise = mongo();

export const getSession: GetSession = async ({ locals }) => {
  return locals.user
};

export const handle: Handle = async ({ event, resolve }) => {
  try {
    await dbPromise;
    const cookies = cookie.parse(event.request.headers.get('cookie') || '');
    const session_id = cookies.session_id
    if(session_id){
      const session = await SessionSchema.findOne({_id: session_id})
      if(session){
        const user = await UserSchema.findOne({ _id: session.user_id })
        if(user){
          event.locals.user = {
            id: user._id.toString(),
            username: user?.username,
            access: user?.access,
            verified: user?.verified,
            avatar_url: user?.avatar_url
          };
        }
      } else {
        //TBA: clear session cookie
      }
    }

    const response = await resolve(event);

    return response;
  } catch (error) {
    // makes debugging easier
    if (dev) throw error;

    console.error(error);
    webhooks.unhandledError({
      message: String(error),
      triggeredAt: new Date().getTime(),
    });
    return new Response(null, {
      status: 500,
    });
  }
};
