import { error, json } from '@sveltejs/kit';
import { Access, accessLevels } from '@/lib/auth/access';
import { SchematicChangeSchema } from '@/server/mongo';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (req) => {
  const access = req.locals.user?.access ?? accessLevels.none;
  if (!access.can({ schematics: Access.deleteAll | Access.updateAll }))
    throw error(403, 'Forbidden');

  await SchematicChangeSchema.deleteOne({
    _id: req.params.id,
  });
  return json(
    {
      message: `Deleted change ${req.params.id}`,
    },
    {
      headers: {
        location: '/admin/schematic_changes',
      },
    },
  );
};
