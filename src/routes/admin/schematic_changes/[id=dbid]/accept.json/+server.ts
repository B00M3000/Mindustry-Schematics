import { error, json } from '@sveltejs/kit';
import { Access, accessLevels } from '@/lib/auth/access';
import { SchematicChangeSchema, SchematicSchema } from '@/server/mongo';
import type { SchematicDocument } from '@/server/mongo';
import webhooks from '@/server/webhooks';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (req) => {
  const access = req.locals.user?.access ?? accessLevels.none;
  if (!access.can({ schematics: Access.deleteAll | Access.updateAll }))
    throw error(403, 'Forbidden');
  const change = await SchematicChangeSchema.findOne({ _id: req.params.id });
  if (!change) throw error(404, 'Change not found');
  if (change.Delete) {
    const schematic = (await SchematicSchema.findOneAndDelete({
      _id: change.id,
    })) as SchematicDocument;
    await SchematicChangeSchema.deleteMany({
      id: change.id,
    });
    webhooks.deleteSchematic({
      triggeredAt: new Date().getTime(),
      reason: change.Description || '',
      schematicId: schematic._id.toString(),
      schematicName: schematic.name,
    });
  } else {
    const schematic = (await SchematicSchema.findOneAndUpdate(
      {
        _id: change.id,
      },
      change.Changed,
    )) as SchematicDocument;
    await SchematicChangeSchema.deleteOne({
      _id: change._id,
    });
    webhooks.editSchematic({
      changes: change.Description || '',
      schematicId: schematic._id.toString(),
      schematicName: schematic.name,
      triggeredAt: new Date().getTime(),
    });
  }
  return json(
    {
      message: 'Success',
    },
    {
      headers: {
        location: '/admin/schematic_changes',
      },
    },
  );
};
