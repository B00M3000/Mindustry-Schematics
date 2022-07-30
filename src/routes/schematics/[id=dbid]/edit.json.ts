import { SchematicChangeSchema, SchematicSchema } from '@/server/mongo';
import type { SchematicDocument } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';
import { Tag } from '@/lib/tags';
import { Schematic } from 'mindustry-schematic-parser';
import { parseFormData } from '@/server/body_parsing';
import { Access } from '@/lib/auth/access';
import webhooks from '@/server/webhooks';

type Params = {
  id: string;
};

interface PostBody {
  name: string;
  creator: string;
  text: string;
  description: string;
  tags: string;
  cDescription?: string;
}
type PostOutput = { error: string } | { change: string } | { message: string };
export const POST: RequestHandler<Params, PostOutput> = async ({
  params,
  request,
  url,
  locals,
}) => {
  if (!locals.user)
    return {
      status: 403,
      body: {
        error: 'Unauthorized, please login before trying agian.',
      },
    };
  const originalSchematic = await SchematicSchema.findOne({
    _id: params.id,
  });
  if (!originalSchematic)
    return {
      status: 404,
      headers: {
        location: '/',
      },
      body: { error: 'Not found' },
    };
  const {
    name,
    text,
    creator,
    description,
    cDescription,
    tags: stringTags,
  }: Partial<PostBody> = (await parseFormData(request)) ?? (await request.json());

  if (!text || !name || !description || !stringTags) {
    return {
      status: 400,
      body: { error: 'Missing required data' },
    };
  }

  let tags: string[] | undefined;
  try {
    tags = Tag.parse(JSON.parse(stringTags) as string[]).map((tag) => tag.name);
  } catch (error) {
    tags = undefined;
  }

  const schematic = Schematic.decode(text);
  const { powerBalance, powerConsumption, powerProduction, requirements } = schematic;
  const data = (await schematic.render()).toBuffer();
  const mimetype = 'image/png';

  schematic.name = name;
  schematic.description = description;

  const changedSchematic = {
    name,
    creator: creator,
    tags: tags,
    text: schematic.encode(),
    description,
    encoding_version: schematic.version,
    powerBalance,
    powerConsumption,
    powerProduction,
    requirements,
    image: {
      Data: data,
      ContentType: mimetype,
    },
  };

  if (url.searchParams.get('direct')) {
    if (
      locals.user &&
      (locals.user.access.can({ schematics: Access.deleteAll }) ||
        locals.user.id == originalSchematic.creator_id)
    ) {
      const schematic = (await SchematicSchema.findOneAndUpdate(
        {
          _id: params.id,
        },
        changedSchematic,
      )) as SchematicDocument;
      await SchematicChangeSchema.deleteOne({
        _id: params.id,
      });
      webhooks.editSchematic({
        changes: `Direct Edit by ${locals.user.username}\n${cDescription}`,
        schematicId: schematic._id.toString(),
        schematicName: schematic.name,
        triggeredAt: new Date().getTime(),
      });
      return {
        status: 200,
        headers: {
          location: `/schematics/${params.id}`,
        },
      };
    } else {
      return {
        status: 403,
        body: {
          message: 'Unauthorized',
        },
      };
    }
  } else {
    const change = await SchematicChangeSchema.create({
      id: originalSchematic._id,
      Changed: changedSchematic,
      Description: cDescription,
      creator_id: locals.user.id,
    });

    return {
      status: 200,
      headers: {
        location: `/schematics/${originalSchematic._id}`,
      },
      body: { change: change._id.toString() },
    };
  }
};
