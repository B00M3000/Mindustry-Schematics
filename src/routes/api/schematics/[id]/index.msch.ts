import { SchematicSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async (req) => {
  const schematic = await SchematicSchema.findOne({ _id: req.params.id }, 'name text');

  if (!schematic) return { status: 404, body: 'Not found' };
  const body = Buffer.from(schematic.text, 'base64');
  const filename = encodeURIComponent(schematic.name);
  return {
    status: 200,
    headers: {
      'cache-control': 'max-age=1800',
      'content-disposition': `inline; filename="${filename}.msch"`,
      'content-type': 'application/octet-stream',
      'content-length': body.length.toString(),
    },
    body,
  };
};