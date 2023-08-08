import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { UserSchema, type UserDocument } from '@/server/mongo';
import type { FilterQuery } from 'mongoose';
import { getPaginatedQueryPosition } from '@/server/schematic_pagination';

const limitPerPage = 10;

export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get('q') || '';
  const accessQuery = url.searchParams.get('a')

  const dbQuery: FilterQuery<UserDocument> = {};
  if (query) {
    dbQuery.username = new RegExp(query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
  }
  if(accessQuery) dbQuery.access = accessQuery

  try {
    const documents = await UserSchema.countDocuments(dbQuery);

    const users = await UserSchema.find(dbQuery, '_id', {
      limit: limitPerPage,
      sort: {
        _id: -1,
      },
    });

    const body = {
      users,
      query
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