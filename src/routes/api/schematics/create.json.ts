import type { RequestHandler } from '@sveltejs/kit';
import { Schematic } from 'mindustry-schematic-parser';
import type { Tag } from '@/interfaces/tag';
import Tags from '@/../tags.json';
import { SchematicSchema } from '@/server/mongo';
import { parseForm } from '@/server/parse_body';
import webhooks from '@/server/webhooks';

type Body = {
  name: string;
  creator: string;
  text: string;
  description: string;
  tags: string;
};
type GetOutput =
  | {
      message: string;
    }
  | {
      error: string;
    };
export const post: RequestHandler<unknown, Body, GetOutput> = async (req) => {
  // eslint-disable-next-line prefer-const
  let { name, creator, text, description, tags: rawTags } = parseForm<Body>(req.body);
  if (!name || !creator || !text || !description || !rawTags)
    return {
      status: 400,
      body: {
        error: 'Missing required fields',
      },
    };
  try {
    const schematic = Schematic.decode(text);

    const tags = (JSON.parse(rawTags) as Tag[])
      .map((tag) => tag.name)
      .filter((n) => Tags.find((t) => t.name.toLowerCase() === n.toLowerCase()));

    const { powerBalance, powerConsumption, powerProduction, requirements } = schematic;
    const data = await schematic.toImageBuffer();
    const mimetype = 'image/png';

    schematic.name = name;
    schematic.description = description;

    text = schematic.encode();

    const newSchematic = {
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

    const { id } = await new SchematicSchema(newSchematic).save();
    webhooks.createSchematic({
      triggeredAt: new Date().getTime(),
      schematicId: id,
      schematicName: newSchematic.name,
    });
    return {
      status: 200,
      headers: {
        location: `/schematics/${id}`,
      },
      body: {
        message: 'Success',
      },
    };
  } catch (error) {
    return {
      status: 422,
      headers: {
        location: '/schematics',
      },
      body: {
        error: 'Could not create schematic',
      },
    };
  }
};
