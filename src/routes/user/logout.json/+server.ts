import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
export const POST: RequestHandler = ({ cookies }) => {
  return json(
    {
      message: 'Success',
    },
    {
      headers: {
        location: '/user',
        'set-cookie': cookies.serialize('session_id', '', {
          path: '/',
        }),
      },
    },
  );
};
