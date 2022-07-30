import { parseFormData } from '@/server/body_parsing';
import { SchematicChangeSchema, SchematicSchema } from '@/server/mongo';
import type { SchematicDocument } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';
import { UserAccess, Access } from '@/lib/auth/access'
import webhooks from '@/server/webhooks';

type Params = {
  id: string;
};

interface PostBody {
  reason: string;
}

type PostOutput = { error: string } | { change: string };
export const POST: RequestHandler<Params, PostOutput> = async ({ params, request, url, locals }) => {
  if(!locals.user) return {
    status: 403,
      body: {
        error: 'Unauthorized, please login before trying agian.',
      },
  }
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
  if(url.searchParams.get('direct')){
    if(locals.user && ( UserAccess.from(locals.user.access).can({ schematics: Access.deleteAll }) || locals.user.id == schematic.creator_id)){
      const schematic = (await SchematicSchema.deleteOne({
        _id: params.id,
      }));
      await SchematicChangeSchema.deleteMany({
        id: params.id,
      });
      webhooks.deleteSchematic({
        triggeredAt: new Date().getTime(),
        reason: "Direct Deletion by " + locals.user.username + "\n" + reason,
        schematicId: params.id,
        schematicName: schematic.name,
      });
      return {
        status: 200,
        headers: {
          location: `/`,
        },
      };
    } else {
      return {
        status: 403,
        body: {
          message: "Unauthorized"
        },
      };
    }
  } else {
    const change = await SchematicChangeSchema.create({
      id: schematic._id,
      Delete: reason,
      creator_id: locals.user.id
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
  }
};
