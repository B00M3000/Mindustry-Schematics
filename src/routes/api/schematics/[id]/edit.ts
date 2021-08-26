import { SchematicChangeSchema, SchematicSchema } from '@/server/mongo';
import type { Tag } from '@/interfaces/tag';
import type { RequestHandler } from '@sveltejs/kit';
import Tags from '@/../tags.json';
import { Schematic } from 'mindustry-schematic-parser';
import { parseForm } from '@/server/parse_body';
import type { Locals } from '@/interfaces/app';
interface Body {
  name: string;
  creator: string;
  text: string;
  description: string;
  tags: string;
  cDescription: string;
}
type PostOutput = { error: string } | { change: string };
export const post: RequestHandler<Locals, unknown, PostOutput> = async (req) => {
  const originalSchematic = await SchematicSchema.findOne({
    _id: req.params.id,
  });
  if (!originalSchematic)
    return {
      status: 404,
      headers: {
        location: '/',
      },
      body: { error: 'Not found' },
    };
  const parsedForm = parseForm<Body>(req.body);
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
    tags = (JSON.parse(stringTags) as Tag[])
      .map((tag) => tag.name)
      .filter((n) => Tags.find((t) => t.name.toLowerCase() === n.toLowerCase()));
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
