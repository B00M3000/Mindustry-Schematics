import cookie from 'cookie';
// import { v4 as uuid } from "@lukeed/uuid";
import type { GetSession, Handle } from '@sveltejs/kit';
import mongo from '@/server/mongo';
import type { Locals, ClientSession } from './interfaces/app';
import { ServerSession } from './server/auth/session';
import webhooks from './server/webhooks';
import { dev } from '$app/env';

const dbPromise = mongo();

export const getSession: GetSession<Locals, ClientSession> = async ({ locals }) => {
  let session = {};

  const { session: serverSession } = locals;

  if (serverSession) {
    const { user } = serverSession;
    session = {
      ...session,
      user: {
        name: user.name,
        id: user.id,
        access: user.access.toJSON(),
        avatar: user.avatar,
      },
    };
  }

  return session;
};

export const handle: Handle<Locals> = async ({ request, resolve }) => {
  try {
    await dbPromise;
    const cookies = cookie.parse(request.headers.cookie || '');
    const session = await ServerSession.get(cookies.session_id);
    request.locals = {
      session,
    };
    // TODO https://github.com/sveltejs/kit/issues/1046
    const response = await resolve({
      ...request,
      method: (request.query.get('_method') || request.method).toUpperCase(),
    });

    return response;
  } catch (error) {
    // makes debugging easier
    if (dev) throw error;

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
