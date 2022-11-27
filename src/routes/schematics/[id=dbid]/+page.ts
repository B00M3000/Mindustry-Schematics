import type { SchematicJSON } from '@/interfaces/json';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
  const { id } = params;
  const query = new URLSearchParams();
  query.append('increment', 'true');
  const response = await fetch(`/schematics/${id}.json?${query}`);
  const schematic: SchematicJSON = await response.json();
  if (!Object.keys(schematic).length) throw redirect(307, '/');
  return { schematic };
};
