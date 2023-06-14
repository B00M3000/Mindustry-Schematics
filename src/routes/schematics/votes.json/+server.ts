import { error, json } from '@sveltejs/kit';
import type { SchematicDocument } from '@/server/mongo';
import { SchematicSchema } from '@/server/mongo';
import type { RequestHandler } from './$types';
import { match } from '@/params/dbid';

export const POST: RequestHandler = async ({ request, locals }) => {
  const schematicIDs = await request.json()
    .catch(() => console.log('Syntax Error in Votes JSON Array Provided.'));

  if(schematicIDs === undefined) return json({ body: { message: "Syntax Error in Votes JSON Array Provided."} }, { status: 400 })
  if(!schematicIDs.every(match)) return json({ body: { message: "Non-HexID in JSON Array Provided."} }, { status: 400 })

  const schematicsVotes = await SchematicSchema.find({ _id: { $in: schematicIDs } }, '_id votes')

  return json(schematicsVotes, { status: 200 })
};
