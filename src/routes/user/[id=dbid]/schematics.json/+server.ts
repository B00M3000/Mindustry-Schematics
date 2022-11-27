import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SchematicSchema } from '@/server/mongo';

export const GET: RequestHandler = async (req) => {
  const schematics = await SchematicSchema.find(
    { creator_id: req.params.id },
    '_id name text',
  );

  if (!schematics) throw error(404, 'No schematics found for this user.');

  return json({
    schematics,
  });
};
