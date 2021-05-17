import cookie from 'cookie';
// import { v4 as uuid } from "@lukeed/uuid";
import type { GetContext, GetSession, Handle } from '@sveltejs/kit';
import mongo from '@/server/mongo';
import type { Context, Session } from './interfaces/app';
import { User } from './server/auth/user';
import webhooks from './server/webhooks';
/** **This function should not be imported manually** */
export const getContext: GetContext<Context> = async (request) => {
  await mongo();
  const cookies = cookie.parse(request.headers.cookie || '');
  const user = await User.get(cookies.token);
  return {
    name: user?.name,
    token: user?.token,
    access: user?.access.name,
  };
};
export const getSession: GetSession<Context, Session> = async ({ context }) => {
  return {
    name: context.name,
    token: context.token,
    access: context.access,
  };
};
export const handle: Handle = async ({ request, render }) => {
  try {
    // TODO https://github.com/sveltejs/kit/issues/1046
    const response = await render({
      ...request,
      method: (request.query.get('_method') || request.method).toUpperCase(),
    });

    return response;
  } catch (error) {
    webhooks.unhandledError({
      message: String(error),
      triggeredAt: new Date().getTime(),
    });
    throw error;
  }
};
