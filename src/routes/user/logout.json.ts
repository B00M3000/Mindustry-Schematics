import type { RequestHandler } from '@sveltejs/kit';
import * as cookie from 'cookie';
export const POST: RequestHandler = () => {
  return {
    status: 200,
    headers: {
      location: '/user',
      'set-cookie': cookie.serialize('session_id', '', {
        path: '/',
      }),
    },
    body: {
      message: 'Success',
    },
  };
};
