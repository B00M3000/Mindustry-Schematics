import { error } from '@sveltejs/kit';
import { SchematicChangeSchema } from '@/server/mongo';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (req) => {
  const schematic = await SchematicChangeSchema.findOne(
    { _id: req.params.id },
    {
      Changed: {
        image: true,
      },
    },
  );

  if (!schematic || !schematic.Changed) throw error(404, 'Not found');
  const body = Buffer.from(schematic.Changed.image.Data.buffer);
  const filename = encodeURIComponent(schematic.Changed.name);
  return new Response(body, {
    headers: {
      'cache-control': 'max-age=1800',
      'content-disposition': `inline; filename="${filename}.png"`,
      'content-Type': 'image/png',
      'content-Length': body.length.toString(),
    },
  });
};
