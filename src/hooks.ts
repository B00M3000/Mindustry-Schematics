import cookie from 'cookie';
import type { GetSession, Handle } from '@sveltejs/kit';
import mongo from '@/server/mongo';
import { User } from './server/auth/user';
import webhooks from './server/webhooks';
import { dev } from '$app/env';

const dbPromise = mongo();

export const getSession: GetSession = async ({ locals }) => {
  return {
    name: locals.name,
    token: locals.token,
    access: locals.access,
  };
};

export const handle: Handle = async ({ event, resolve }) => {
  try {
    await dbPromise;
    const cookies = cookie.parse(event.request.headers.get('cookie') || '');
    const user = await User.get(cookies.token);
    event.locals = {
      token: user?.token,
      access: user?.access.name,
      name: user?.name,
    };
    // TODO https://github.com/sveltejs/kit/issues/1046
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
