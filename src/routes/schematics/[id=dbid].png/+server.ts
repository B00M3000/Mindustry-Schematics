import { error } from '@sveltejs/kit';
import { SchematicSchema } from '@/server/mongo';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (req) => {
  const schematic = await SchematicSchema.findOne({ _id: req.params.id }, 'name image');

  if (!schematic) throw error(404, 'Not found');
  const body = schematic.image.Data;
  const filename = encodeURIComponent(schematic.name);

  return new Response(body, {
    headers: {
      'cache-control': 'max-age=1800',
      'content-disposition': `inline; filename="${filename}.png"`,
      'content-type': 'image/png',
      'content-length': body.length.toString(),
    },
  });
};
