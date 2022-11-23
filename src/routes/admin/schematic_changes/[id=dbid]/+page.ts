import type { SchematicChangeJSON } from '@/interfaces/json';
import { Access, UserAccess } from '@/lib/auth/access';
import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params, parent }) => {
  const { session } = await parent();
  const access = UserAccess.from(session?.access);
  if (
    !access.can({
      schematics: Access.deleteAll | Access.updateAll,
    })
  )
    throw error(403, 'Forbidden');
  const response = await fetch(`/admin/schematic_changes/${params.id}/change.json`);
  const json: SchematicChangeJSON = await response.json();
  return {
    data: json,
  };
};
