import { SchematicChangeSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async (req) => {
  const schematic = await SchematicChangeSchema.findOne(
    { _id: req.params.id },
    {
      Changed: {
        image: true,
      },
    },
  );

  if (!schematic || !schematic.Changed) return { status: 404, body: 'Not found' };
  const body = Buffer.from(schematic.Changed.image.Data.buffer);
  const filename = encodeURIComponent(schematic.Changed.name);
  return {
    status: 200,
    headers: {
      'cache-control': 'max-age=1800',
      'content-disposition': `inline; filename="${filename}.png"`,
      'content-Type': 'image/png',
      'content-Length': body.length.toString(),
    },
    body,
  };
};
