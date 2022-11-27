import { json } from '@sveltejs/kit';
import { getTutorials } from '@/server/tutorials';
import type { RequestHandler } from './$types';

interface TutorialInfo {
  title: string;
  name: string;
}
export const GET: RequestHandler = async () => {
  const tutorials = getTutorials();
  const body: TutorialInfo[] = [];
  tutorials.forEach((value, key) => {
    body.push({
      title: value.title,
      name: key,
    });
  });
  return json(body, {
    headers: {
      'cache-control': 'max-age=86400', // cache for 1 day
    },
  });
};
