import { SchematicDeleteRequestSchema, SchematicSchema } from '@/server/mongo';
import { parseForm } from '@/server/parse_body';
import type { RequestHandler } from '@sveltejs/kit';
interface Body {
  reason: string;
}
type PostOutput = { error: string } | { change: string };
export const post: RequestHandler<unknown, Body, PostOutput> = async (req) => {
  const schematic = await SchematicSchema.findOne({ _id: req.params.id });
  if (!schematic)
    return {
      status: 404,
      body: { error: 'Schematic not found' },
    };
  const { reason } = parseForm<Body>(req.body);

  const change = await SchematicDeleteRequestSchema.create({
    schematic_id: schematic._id,
    reason,
  });

  return {
    status: 200,
    body: {
      change: change._id,
    },
  };
};
