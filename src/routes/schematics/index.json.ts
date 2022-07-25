import type { SchematicQueryJSON } from '@/interfaces/json';
import { SchematicSchema } from '@/server/mongo';
import type { SchematicDocument } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';
import type { FilterQuery } from 'mongoose';
import { Schematic } from 'mindustry-schematic-parser';
import { Tag } from '@/lib/tags';
import webhooks from '@/server/webhooks';
import { parseFormData } from '@/server/body_parsing';
type QueryMode = 'creator' | 'name';

interface PostBody {
  name: string;
  creator: string;
  text: string;
  description: string;
  tags: string;
}

type PostOutput = { message: string } | { error: string };

const limitPerPage = 20;
export const GET: RequestHandler = async ({ url }) => {
  let page = Number(url.searchParams.get('page')) || 1;
  if (page < 1) page = 1;
  const mode: QueryMode = url.searchParams.get('mode') == 'creator' ? 'creator' : 'name';
  const query = url.searchParams.get('query') || '';
  const tags = url.searchParams.get('tags') || '';
  const skip = limitPerPage * (page - 1);

  const dbQuery: FilterQuery<SchematicDocument> = {};
  if (query) {
    dbQuery[mode] = new RegExp(query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
  }
  if (tags) {
    dbQuery.tags = { $all: tags.split(' ').map((t) => t.replace(/_/g, ' ')) };
  }
  try {
    const documents = await SchematicSchema.countDocuments(dbQuery);

    const pages = Math.ceil(documents / limitPerPage) || 1;
    if (page > pages) page = pages;

    const schematics = await SchematicSchema.find(dbQuery, '_id name text', {
      skip,
      limit: limitPerPage,
      sort: {
        _id: -1,
      },
    });
    const body: SchematicQueryJSON = {
      skip,
      query,
      page,
      pages,
      documents,
      schematics,
      tags,
      mode,
    };
    return {
      status: 200,
      headers: {
        'cache-control': 'max-age=120',
      },
      body: body as never,
    };
  } catch (e) {
    return {
      status: 500,
      body: {
        error: String(e),
      },
    };
  }
};

export const POST: RequestHandler<never, PostOutput> = async (req) => {
  if(!req.locals.user) return {
    status: 403,
      body: {
        error: 'Unauthorized, please login before trying agian.',
      },
  }
  const {
    name,
    text,
    description,
    tags: rawTags,
  }: Partial<PostBody> = (await parseFormData(req.request)) ?? (await req.request.json());
  if (!name || !text || !description || !rawTags)
    return {
      status: 400,
      body: {
        error: 'Missing required fields',
      },
    };
  try {
    const schematic = Schematic.decode(text);

    const tags = Tag.parse(JSON.parse(rawTags) as string[]).map((tag) => tag.name);

    const { powerBalance, powerConsumption, powerProduction, requirements } = schematic;
    const data = await (await schematic.render()).toBuffer();
    const mimetype = 'image/png';

    schematic.name = name;
    schematic.description = description;

    const newText = schematic.encode();

    const newSchematic = {
      name,
      creator_id: req.locals.user.id,
      tags: tags,
      text: newText,
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

    const { id } = await SchematicSchema.create(newSchematic);
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
