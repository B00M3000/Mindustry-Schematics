import cookie from 'cookie';
// import { v4 as uuid } from "@lukeed/uuid";
import type { GetSession, Handle } from '@sveltejs/kit';
import mongo from '@/server/mongo';
import type { Locals, Session } from './interfaces/app';
import { User } from './server/auth/user';
import webhooks from './server/webhooks';

const dbPromise = mongo();

export const getSession: GetSession<Locals, Session> = async ({ locals }) => {
  return {
    name: locals.name,
    token: locals.token,
    access: locals.access,
  };
};

export const handle: Handle<Locals> = async ({ request, resolve }) => {
  try {
    await dbPromise;
    const cookies = cookie.parse(request.headers.cookie || '');
    const user = await User.get(cookies.token);
    request.locals = {
      token: user?.token,
      access: user?.access.name,
      name: user?.name,
    };
    // TODO https://github.com/sveltejs/kit/issues/1046
    const response = await resolve({
      ...request,
      method: (request.query.get('_method') || request.method).toUpperCase(),
    });

    return response;
  } catch (error) {
    console.error(error);
    webhooks.unhandledError({
      message: String(error),
      triggeredAt: new Date().getTime(),
    });
    return {
      headers: {},
      status: 500,
    };
  }
};
