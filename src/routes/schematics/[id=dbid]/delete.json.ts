import { parseFormData } from '@/server/body_parsing';
import { SchematicChangeSchema, SchematicSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';

type Params = {
  id: string;
};

interface PostBody {
  reason: string;
}

type PostOutput = { error: string } | { change: string };
export const POST: RequestHandler<Params, PostOutput> = async ({ params, request }) => {
  const schematic = await SchematicSchema.findOne({ _id: params.id });
  if (!schematic)
    return {
      status: 404,
      headers: {
        location: '/',
      },
      body: { error: 'Schematic not found' },
    };
  const { reason }: Partial<PostBody> =
    (await parseFormData(request)) ?? (await request.json());

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
