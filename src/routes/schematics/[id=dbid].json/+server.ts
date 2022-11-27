import { error, json } from '@sveltejs/kit';
import type { SchematicDocument } from '@/server/mongo';
import { SchematicSchema } from '@/server/mongo';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (req) => {
  let schematic: SchematicDocument | null;
  if (req.url.searchParams.get('increment')) {
    schematic = await SchematicSchema.findOneAndUpdate(
      { _id: req.params.id },
      {
        $inc: { views: 1 },
      },
      {
        projection: '-image',
      },
    );
  } else {
    schematic = await SchematicSchema.findOne({ _id: req.params.id }, '-image');
  }
  if (!schematic) throw error(404);
  return json(schematic);
};
