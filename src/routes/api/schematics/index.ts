import type { SchematicQueryJSON } from '@/interfaces/json';
import { SchematicDocument, SchematicSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';
import type { FilterQuery } from 'mongoose';
type QueryMode = 'creator' | 'name';
const limitPerPage = 20;
export const get: RequestHandler = async (req) => {
  let page = Number(req.query.get('page')) || 1;
  if (page < 1) page = 1;
  const mode: QueryMode = req.query.get('mode') == 'creator' ? 'creator' : 'name';
  const query = req.query.get('query') || '';
  const tags = req.query.get('tags') || '';
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
      body: body as never,
    };
  } catch (e) {
    return { status: 500, body: String(e) };
  }
};
