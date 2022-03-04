import { SchematicSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';
import mongoose from 'mongoose';

export const get: RequestHandler = async (req) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return {
      status: 400,
      body: { error: 'Invalid schematic id' },
    };
  }
  const schematic = await SchematicSchema.findOne({ _id: req.params.id }, 'name image');

  if (!schematic) return { status: 404, body: 'Not found' };
  const body = schematic.image.Data;
  const filename = encodeURIComponent(schematic.name);
  return {
    status: 200,
    headers: {
      'cache-control': 'max-age=1800',
      'content-disposition': `inline; filename="${filename}.png"`,
      'content-type': 'image/png',
      'content-length': body.length.toString(),
    },
    body,
  };
};
