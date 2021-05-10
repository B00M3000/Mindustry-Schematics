import type { Context } from '@/interfaces/app';
import { UserAccess } from '@/lib/auth/access';
import { SchematicChangeSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler<Context> = async (req) => {
  const access = UserAccess.from(req.context.access);
  if (!access.can({ schematics: ['delete', 'update'] }))
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
