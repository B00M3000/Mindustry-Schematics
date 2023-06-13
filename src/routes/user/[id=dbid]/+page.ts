import type { UserSchematicQueryJSON } from '@/interfaces/json';
import type { PageLoad } from './$types';
export const load: PageLoad = async ({ params, fetch, url }) => {
  const response = await fetch(`/user/${params.id}/schematics.json${url.search}`);
  const profile: UserSchematicQueryJSON = await response.json();
  return {
    user_id: params.id,
    profile,
  };
};
