import type { SchematicChangeInfoQueryJSON } from '@/interfaces/json';
import { Access, UserAccess } from '@/lib/auth/access';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent, url }) => {
  const { session } = await parent();
  const access = UserAccess.from(session.access);
  if (!access.can({ schematics: Access.deleteAll | Access.updateAll })) {
    throw redirect(302, '/user');
  }
  const response = await fetch(`/admin/schematic_changes/changes.json${url.search}`);
  const query: SchematicChangeInfoQueryJSON = await response.json();
  return {
    query,
  };
};
