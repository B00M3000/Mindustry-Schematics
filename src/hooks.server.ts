import type { Handle } from '@sveltejs/kit';
import mongoose from 'mongoose';
import mongo from '@/server/mongo';
import { SessionSchema, UserSchema } from './server/mongo';
import webhooks from './server/webhooks';
import { dev } from '$app/environment';
import { UserAccess } from './lib/auth/access';

const dbPromise = mongo();

export const handle: Handle = async ({ event, resolve }) => {
  try {
    await dbPromise;
    const session_id = event.cookies.get('session_id');
    if (session_id && mongoose.isObjectIdOrHexString(session_id)) {
      const session = await SessionSchema.findOne({ _id: session_id });
      if (session) {
        const user = await UserSchema.findOne({ _id: session.user_id });
        if (user) {
          event.locals.user = {
            id: user._id.toString(),
            username: user.username,
            access: UserAccess.from(user.access),
            verified: user.verified ?? false,
            avatar_url: user.avatar_url,
            description: user.description || ""
          };
        }
      } else {
        //event.request.headers.set('set-cookie', cookie.serialize('session_id', ''))
      }
    } else {
      //event.request.headers.set('set-cookie', cookie.serialize('session_id', ''))
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
