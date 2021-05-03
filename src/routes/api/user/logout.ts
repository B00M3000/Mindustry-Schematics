import type { RequestHandler } from '@sveltejs/kit';
import * as cookie from 'cookie';
export const post: RequestHandler = () => {
  return {
    status: 200,
    headers: {
      location: '/user',
      'set-cookie': cookie.serialize('token', '', {
        path: '/',
      }),
    },
    body: {},
  };
};
