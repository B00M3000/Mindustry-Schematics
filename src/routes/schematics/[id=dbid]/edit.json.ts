import { SchematicChangeSchema, SchematicSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';
import { Tag } from '@/lib/tags';
import { Schematic } from 'mindustry-schematic-parser';
import { parseFormData } from '@/server/body_parsing';

type Params = {
  id: string;
};

interface PostBody {
  name: string;
  creator: string;
  text: string;
  description: string;
  tags: string;
  cDescription: string;
}
type PostOutput = { error: string } | { change: string };
export const POST: RequestHandler<Params, PostOutput> = async ({ params, request, locals }) => {
  if(!locals.user) return {
    status: 403,
      body: {
        error: 'Unauthorized, please login before trying agian.',
      },
  }
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

  if (!text || !name || !description || !cDescription || !stringTags) {
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
  const data = await (await schematic.render()).toBuffer();
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

  const change = await SchematicChangeSchema.create({
    id: originalSchematic._id,
    Changed: changedSchematic,
    Description: cDescription,
    creator_id: locals.user.id
  });

  return {
    status: 200,
    headers: {
      location: `/schematics/${originalSchematic._id}`,
    },
    body: { change: change._id },
  };
};
