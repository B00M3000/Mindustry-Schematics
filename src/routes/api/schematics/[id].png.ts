import { SchematicSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async (req) => {
  const schematic = await SchematicSchema.findOne({ _id: req.params.id });

  if (!schematic) return { status: 404, body: 'Not found' };
  const body = Buffer.from(schematic.image.Data.buffer);
  return {
    status: 200,
    headers: {
      'cache-control': 'max-age=1800',
      'content-disposition': `inline; filename="${schematic.name}.png"`,
      'content-type': 'image/png',
      'content-length': body.length.toString(),
    },
    body,
  };
};
