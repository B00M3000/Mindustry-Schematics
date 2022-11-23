import { error, json } from '@sveltejs/kit';
import { getTutorials } from '@/server/tutorials';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (req) => {
  const { name } = req.params;
  const tutorials = getTutorials();
  const tutorial = tutorials.get(name);

  if (!tutorial) throw error(404);
  return json(
    {
      title: tutorial.title,
      html: tutorial.html,
    },
    {
      headers: {
        'cache-control': 'max-age=86400', // cache for 1 day
      },
    },
  );
};
