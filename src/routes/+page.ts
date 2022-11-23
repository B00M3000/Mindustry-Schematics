import type { SchematicQueryJSON } from '@/interfaces/json';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, fetch, setHeaders }) => {
  const response = await fetch(`/schematics.json?${url.searchParams}`);
  const data: SchematicQueryJSON = await response.json();
  setHeaders({
    'cache-control': 'max-age=60',
  });
  return data;
};
