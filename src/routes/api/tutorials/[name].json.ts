import { getTutorials } from '@/server/tutorials';
import type { RequestHandler } from '@sveltejs/kit';
type GetOutput = {
  title: string;
  html: string;
};
export const get: RequestHandler<unknown, unknown, GetOutput> = async (req) => {
  const { name } = req.params;
  const tutorials = getTutorials();
  const tutorial = tutorials.get(name);

  if (!tutorial)
    return {
      status: 404,
    };
  return {
    status: 200,
    headers: {
      'cache-control': 'max-age=86400', // cache for 1 day
    },
    body: {
      title: tutorial.title,
      html: tutorial.html,
    },
  };
};
