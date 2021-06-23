import { SchematicChangeSchema, SchematicSchema } from '@/server/mongo';
import { parseForm } from '@/server/parse_body';
import type { RequestHandler } from '@sveltejs/kit';
interface Body {
  reason: string;
}
export const post: RequestHandler<unknown, Body> = async (req) => {
  const schematic = await SchematicSchema.findOne({ _id: req.params.id });
  if (!schematic)
    return {
      status: 404,
      headers: {
        location: '/',
      },
      body: { error: 'Schematic not found' },
    };
  const { reason } = parseForm<Body>(req.body);

  const change = await SchematicChangeSchema.create({
    id: schematic._id,
    Delete: reason,
  });

  return {
    status: 200,
    headers: {
      location: `/schematics/${schematic._id}`,
    },
    body: {
      change: change._id,
    },
  };
};
