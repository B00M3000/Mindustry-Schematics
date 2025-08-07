import type { PageLoad } from '../$types';

interface TutorialInfo {
  name: string;
  title: string;
}

export const load: PageLoad = async ({ fetch }) => {
  const data = (await (await fetch('/guides.json')).json()) as TutorialInfo[];
  return {
    tutorials: data,
  };
};

// export const prerender = true;
