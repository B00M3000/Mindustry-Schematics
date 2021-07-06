import type { Context } from '@/interfaces/app';
import type { UserSearchJSON } from '@/interfaces/json';
import { UserAccess } from '@/lib/auth/access';
import { escapeRegexString } from '@/lib/string';
import { UserDocument, UserSchema } from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';
import type { FilterQuery } from 'mongoose';
export const get: RequestHandler<Context> = async ({ context, query }) => {
  const access = UserAccess.from(context.access);
  if (!access.can({ users: { read: 'all' } }))
    return {
      status: 403,
      body: {
        message: 'Forbidden',
      },
    };
  const limit = 50;
  const qTag = query.get('tag');
  const qVerified = query.get('verified');
  let verified: boolean | undefined;
  if (qVerified) verified = qVerified.toLowerCase() !== 'false';
  const filter: FilterQuery<UserDocument> = {
    // if verified is true search where verified is true, else search where
    // verified is false or undefined
    verified: verified || { $in: [false, undefined] },
  };
  if (qTag) filter.tag = new RegExp(escapeRegexString(qTag), 'i');
  const documents = await UserSchema.countDocuments(filter);
  const pages = Math.ceil(documents / limit) || 1;
  let page = Number(query.get('page') || 1);
  if (page < 1) page = 1;
  if (page > pages) page = pages;
  const users = await UserSchema.find(filter, 'id tag access verified', {
    limit,
    skip: (page - 1) * limit,
    sort: {
      tag: -1,
    },
  });
  const result: UserSearchJSON = {
    page,
    users,
    pages,
    total: documents,
  };
  return {
    status: 200,
    body: result,
  };
};
