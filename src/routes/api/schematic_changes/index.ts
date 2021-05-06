import type { Context } from '@/interfaces/app';
import type { SchematicChangeInfoJSON } from '@/interfaces/json';
import {
  SchematicChangeDocument,
  SchematicChangeSchema,
  SchematicDocument,
  SchematicSchema,
} from '@/server/mongo';
import type { RequestHandler } from '@sveltejs/kit';
type Changes = Pick<SchematicChangeDocument, 'id' | '_id' | 'Delete'>[];
type Originals = (Pick<SchematicDocument, 'name'> | null)[];
async function findOriginals(changes: Changes): Promise<Originals> {
  const promises = [];
  for (const change of changes) {
    promises.push(SchematicSchema.findOne({ _id: change.id }, 'name'));
  }
  const originals = await Promise.all(promises);
  return originals;
}
export const get: RequestHandler<Context> = async (req) => {
  if (!req.context.isMod) {
    return { status: 403, body: 'Forbidden' };
  }
  const changes: Changes = await SchematicChangeSchema.find({}, 'id _id Delete', {
    sort: {
      _id: -1,
    },
  });
  const originals = await findOriginals(changes);

  const body: SchematicChangeInfoJSON[] = [];
  for (let i = 0; i < changes.length; i++) {
    body.push({
      id: changes[i].id,
      mode: changes[i].Delete ? 'delete' : 'modify',
      name: originals[i]?.name || '[Deleted]',
      _id: changes[i]._id,
    });
  }
  return {
    status: 200,
    body,
  };
};
