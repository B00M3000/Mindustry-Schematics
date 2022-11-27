import type { PageLoad } from '../$types';

export const load: PageLoad = async ({ url }) => {
  const redirect = url.searchParams.get('redirect');
  return { redirect };
};
