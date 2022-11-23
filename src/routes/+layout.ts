import type { LayoutLoad } from './$types';
export const load: LayoutLoad = async ({ fetch, data }) => {
  const backgrounds: string[] = await (await fetch('/backgrounds.json')).json();

  return { backgrounds, session: data.session };
};
