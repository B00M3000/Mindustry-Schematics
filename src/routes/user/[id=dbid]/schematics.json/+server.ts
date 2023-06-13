import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SchematicSchema, type SchematicDocData } from '@/server/mongo';
import { getPaginatedQueryPosition } from '@/server/schematic_pagination';
import type { FilterQuery } from 'mongoose';
import type { UserSchematicQueryJSON } from '@/interfaces/json';

const limitPerPage = 20;

export const GET: RequestHandler = async ({ params, url }) => {
  const searchPage = Number(url.searchParams.get('page')) || 1;

  const filter: FilterQuery<SchematicDocData> = {
    creator_id: params.id,
  };
  const documents = await SchematicSchema.countDocuments(filter);
  const { page, pages, skip } = getPaginatedQueryPosition({
    page: searchPage,
    documents,
    limitPerPage,
  });
  const schematics = await SchematicSchema.find(filter, '_id name text', {
    skip,
    limit: limitPerPage,
    sort: {
      id: -1,
    },
  });

  if (!schematics) throw error(404, 'No schematics found for this user.');

  return json({
    page,
    pages,
    skip,
    documents,
    schematics,
  } satisfies UserSchematicQueryJSON);
};
