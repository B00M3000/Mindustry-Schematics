import { error, json } from '@sveltejs/kit';
import { parseFormData } from '@/server/body_parsing';
import { SchematicChangeSchema, SchematicSchema } from '@/server/mongo';
import type { RequestHandler } from './$types';
import { Access, accessLevels } from '@/lib/auth/access';
import webhooks from '@/server/webhooks';

interface PostBody {
  reason: string;
}

export const POST: RequestHandler = async ({ params, request, url, locals }) => {
  if (!locals.user) throw error(403, 'Unauthorized, please login before trying again.');
  const schematic = await SchematicSchema.findOne({ _id: params.id });
  if (!schematic)
    return json(
      { error: 'Schematic not found' },
      {
        status: 404,
        headers: {
          location: '/',
        },
      },
    );
  const { reason }: Partial<PostBody> =
    (await parseFormData(request)) ?? (await request.json());
  if (url.searchParams.get('direct')) {
    if (
      locals.user &&
      ((locals.user.access ?? accessLevels.none).can({ schematics: Access.deleteAll }) ||
        locals.user.id == schematic.creator_id)
    ) {
      await SchematicSchema.deleteOne({
        _id: params.id,
      });
      await SchematicChangeSchema.deleteMany({
        id: params.id,
      });
      webhooks.deleteSchematic({
        triggeredAt: new Date().getTime(),
        reason: 'Direct Deletion by ' + locals.user.username + '\n' + reason,
        schematicId: params.id,
        schematicName: schematic.name,
      });
      return new Response(undefined, {
        headers: {
          location: `/`,
        },
      });
    } else {
      throw error(403, 'Unauthorized');
    }
  } else {
    const change = await SchematicChangeSchema.create({
      id: schematic._id,
      Delete: reason,
      creator_id: locals.user.id,
    });

    return json(
      { change: change._id.toString() },
      {
        headers: {
          location: `/schematics/${schematic._id}`,
        },
      },
    );
  }
};
