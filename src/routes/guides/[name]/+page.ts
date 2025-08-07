import type { PageLoad } from './$types';

interface TutorialInfo {
  title: string;
  html: string;
}

export const load: PageLoad = async ({ fetch, params }) => {
  const { name } = params;
  const content: TutorialInfo = await (await fetch(`/guides/${name}.json`)).json();
  return { content };
};

// export const prerender = true;
