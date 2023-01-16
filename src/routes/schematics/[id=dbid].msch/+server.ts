import { error } from '@sveltejs/kit';
import { SchematicSchema } from '@/server/mongo';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (req) => {
  const schematic = await SchematicSchema.findOne({ _id: req.params.id }, 'name text');

  if (!schematic) throw error(404, 'Not found');
  const body = Buffer.from(schematic.text, 'base64');
  const filename = encodeURIComponent(schematic.name);
  return new Response(body, {
    headers: {
      'cache-control': 'max-age=1800',
      'content-disposition': `inline; filename="${filename}.msch"`,
      'content-type': 'application/octet-stream',
      'content-length': body.length.toString(),
    },
  });
};
