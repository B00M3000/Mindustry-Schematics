import { error, json } from '@sveltejs/kit';
import type { SchematicDocument } from '@/server/mongo';
import { SchematicSchema } from '@/server/mongo';
import type { RequestHandler } from './$types';
import { match } from '@/params/dbid';

export const GET: RequestHandler = async ({ request, params, url,  locals }) => {   
  if (!locals.user) throw error(403, 'Unauthorized, please login before trying again.');

  switch (url.searchParams.get('v')) {
    case undefined:
      return json({ body: { message: 'No vote choice recieved. (Search param v is undefined)' }}, { status: 400 });
      break;
    case 'up':
      await SchematicSchema.updateOne({ _id: params.id }, { $set: { votes: { [locals.user.id]: 1 }}});
      break;
    case 'down':
      await SchematicSchema.updateOne({ _id: params.id }, { $set:  { votes: { [locals.user.id]: -1 }}});
      break;
    case 'none':
      await SchematicSchema.updateOne({ _id: params.id }, { $unset: { votes: { [locals.user.id]: 0 }}});
      break;
  }

  return json({ body: { message: "Your vote was processed sucessfully!"}}, { status: 200 })
};
