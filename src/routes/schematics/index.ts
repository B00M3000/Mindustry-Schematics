import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
  return {
    status: 308,
    headers: {
      location: '/',
    },
  };
};
