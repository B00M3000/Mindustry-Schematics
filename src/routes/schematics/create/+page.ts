import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  const { session } = await parent();
  if (!session?.id) throw redirect(307, '/user?redirect=/schematics/create');
};
