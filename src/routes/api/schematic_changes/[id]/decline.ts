import type { Locals } from '@/interfaces/app';
import { UserAccess } from '@/lib/auth/access';
import { SchematicChangeSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler<Locals> = async (req) => {
  const access = UserAccess.from(req.locals.access);
  if (!access.can({ schematics: { delete: 'all', update: 'all' } }))
    return {
      status: 403,
      body: 'Forbidden',
    };
  await SchematicChangeSchema.deleteOne({
    _id: req.params.id,
  });
  return {
    status: 200,
    headers: {
      location: '/admin/schematic_changes',
    },
    body: `Deleted change ${req.params.id}`,
  };
};
