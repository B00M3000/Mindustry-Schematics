import type { SchematicJSON } from '@/interfaces/json';
import { Access, UserAccess } from '@/lib/auth/access';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from '../$types';

export const load: PageLoad = async ({ fetch, params, parent }) => {
  const { id } = params;
  const { session } = await parent();
  if (!session?.id) throw redirect(307, `/user?redirect=/schematics/${id}/delete`);

  const response = await fetch(`/schematics/${id}.json`);
  const schematic: SchematicJSON = await response.json();

  const access = UserAccess.from(session.access);
  const directActions =
    access.can({ schematics: Access.deleteAll | Access.updateAll }) ||
    session.id == schematic.creator_id;

  return { schematic, directActions };
};
