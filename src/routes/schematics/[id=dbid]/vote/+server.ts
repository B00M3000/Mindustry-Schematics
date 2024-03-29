import { error, json } from '@sveltejs/kit';
import type { SchematicDocument } from '@/server/mongo';
import { SchematicSchema } from '@/server/mongo';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, params, url,  locals }) => {   
  if (!locals.user) throw error(403, 'Unauthorized, please login before trying again.');
  
  const isUndefined = (await SchematicSchema.findOne({ _id: params.id }, 'votes'))?.votes == undefined;
  if(isUndefined) await SchematicSchema.updateOne({ _id: params.id }, { votes: { 'hi': "bye" } })
  
  switch (url.searchParams.get('v')) {
    case undefined:
      return json({ body: { message: 'No vote choice recieved. (Search param v is undefined)' }}, { status: 400 });
      break;
    case 'up':
      await SchematicSchema.updateOne({ _id: params.id }, { $set: { votes: { [locals.user.id]: 1 }}});
      break;
    case 'down':
      await SchematicSchema.updateOne({ _id: params.id }, { $set: { votes: { [locals.user.id]: -1 }}});
      break;
    case 'none':
      await SchematicSchema.updateOne({ _id: params.id  }, { $unset: { votes: { [locals.user.id]: 0 }}});
      break;
    default:
      return json({ body: { message: `Invalid vote choice recived.`}}, { status: 400 })
  }

  return json({ body: { message: `Your ${url.searchParams.get('v')} vote was processed sucessfully!`}}, { status: 200 })
};
