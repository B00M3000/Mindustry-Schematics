import { SchematicChangeSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';
import mongoose from 'mongoose';

export const get: RequestHandler = async (req) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return {
      status: 400,
      body: 'Invalid change id',
    };
  }
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
