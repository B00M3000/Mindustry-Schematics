import cookie from 'cookie';
// import { v4 as uuid } from "@lukeed/uuid";
<<<<<<< HEAD
import type { GetContext, GetSession, Handle } from '@sveltejs/kit';
import mongo from '@/server/mongo';
import type { Context, Session } from './interfaces/app';
import { User } from './server/auth/user';
import webhooks from './server/webhooks';
/** **This function should not be imported manually** */
export const getContext: GetContext<Promise<Context>> = async (request) => {
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
=======
import type { GetSession, Handle } from '@sveltejs/kit';
import mongo from '@/server/mongo';
import type { Locals, Session } from './interfaces/app';
import { User } from './server/auth/user';
import webhooks from './server/webhooks';
import { dev } from '$app/env';

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
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
      ...request,
      method: (request.query.get('_method') || request.method).toUpperCase(),
    });

    return response;
  } catch (error) {
<<<<<<< HEAD
=======
    // makes debugging easier
    if (dev) throw error;

    console.error(error);
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
    webhooks.unhandledError({
      message: String(error),
      triggeredAt: new Date().getTime(),
    });
<<<<<<< HEAD
    throw error;
=======
    return {
      headers: {},
      status: 500,
    };
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
  }
};
