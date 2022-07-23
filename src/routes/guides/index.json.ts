import { getTutorials } from '@/server/tutorials';
import type { RequestHandler } from '@sveltejs/kit';
type TutorialInfo = {
  title: string;
  name: string;
};
export const GET: RequestHandler<never, TutorialInfo[]> = async () => {
  const tutorials = getTutorials();
  const body: TutorialInfo[] = [];
  tutorials.forEach((value, key) => {
    body.push({
      title: value.title,
      name: key,
    });
  });
  return {
    status: 200,
    headers: {
      'cache-control': 'max-age=86400', // cache for 1 day
    },
    body,
  };
};
