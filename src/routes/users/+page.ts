import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, fetch, setHeaders }) => {
  const response = await fetch(`/users/search.json?${url.searchParams}`);
  const data = await response.json();
  setHeaders({
    'cache-control': 'max-age=60',
  });
  return data;
};
