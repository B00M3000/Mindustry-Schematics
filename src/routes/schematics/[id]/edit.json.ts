import { SchematicChangeSchema, SchematicSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';
import { Tag } from '@/lib/tags';
import { Schematic } from 'mindustry-schematic-parser';
import { parseForm } from '@/server/parse_body';

interface Params {
  id: string;
}

interface Body {
  name: string;
  creator: string;
  text: string;
  description: string;
  tags: string;
  cDescription: string;
}
type PostOutput = { error: string } | { change: string };
export const post: RequestHandler<Params, PostOutput> = async ({ params, request }) => {
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
  const parsedForm = parseForm<Body>(await request.json());
  let { text } = parsedForm;
  const { name, creator, description, cDescription, tags: stringTags } = parsedForm;
  if (!text || !name || !creator || !description || !cDescription || !stringTags) {
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
  const data = await schematic.toImageBuffer();
  const mimetype = 'image/png';

  schematic.name = name;
  schematic.description = description;

  text = schematic.encode();

  const changedSchematic = {
    name,
    creator: creator,
    tags: tags,
    text,
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
  });

  return {
    status: 200,
    headers: {
      location: `/schematics/${originalSchematic._id}`,
    },
    body: { change: change._id },
  };
};
