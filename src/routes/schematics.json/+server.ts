import { error, json } from '@sveltejs/kit';
import type { SchematicQueryJSON } from '@/interfaces/json';
import { SchematicSchema } from '@/server/mongo';
import type { SchematicDocument } from '@/server/mongo';
import type { RequestHandler } from './$types';
import type { FilterQuery } from 'mongoose';
import { Schematic } from 'mindustry-schematic-parser';
import { Tag } from '@/lib/tags';
import webhooks from '@/server/webhooks';
import { parseFormData } from '@/server/body_parsing';
import { getPaginatedQueryPosition } from '@/server/schematic_pagination';

interface PostBody {
  name: string;
  creator: string;
  text: string;
  description: string;
  tags: string;
}

const limitPerPage = 20;
export const GET: RequestHandler = async ({ url }) => {
  const searchPage = Number(url.searchParams.get('page')) || 1;
  const query = url.searchParams.get('query') || '';
  const tags = url.searchParams.get('tags') || '';

  const dbQuery: FilterQuery<SchematicDocument> = {};
  if (query) {
    dbQuery.name = new RegExp(query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
  }
  if (tags) {
    dbQuery.tags = { $all: tags.split(' ').map((t) => t.replace(/_/g, ' ')) };
  }
  try {
    const documents = await SchematicSchema.countDocuments(dbQuery);
    const { page, pages, skip } = getPaginatedQueryPosition({
      documents,
      limitPerPage,
      page: searchPage,
    });

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
    };
    return json(body, {
      headers: {
        'cache-control': 'max-age=120',
      },
    });
  } catch (e) {
    return json({ error: String(e) }, { status: 500 });
  }
};

export const POST: RequestHandler = async (req) => {
  if (!req.locals.user)
    throw error(403, 'Unauthorized, please login before trying again.');
  const {
    name,
    text,
    description,
    tags: rawTags,
  }: Partial<PostBody> = (await parseFormData(req.request)) ?? (await req.request.json());
  if (!name || !text || !description || !rawTags)
    throw error(400, 'Missing required fields');
  try {
    const schematic = Schematic.decode(text);

    const tags = Tag.parse(JSON.parse(rawTags) as string[]).map((tag) => tag.name);

    const { powerBalance, powerConsumption, powerProduction, requirements } = schematic;
    const data = (await schematic.render()).toBuffer();
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
    return json(
      { message: 'Success' },
      {
        headers: {
          location: `/schematics/${id}`,
        },
      },
    );
  } catch (e) {
    return json(
      {
        message: 'Could not create the schematic',
        error: e,
      },
      {
        status: 422,
        headers: { location: '/' },
      },
    );
  }
};
