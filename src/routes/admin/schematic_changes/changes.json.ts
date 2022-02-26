import type { SchematicChangeInfoJSON } from '@/interfaces/json';
import { Access, UserAccess } from '@/lib/auth/access';
import { SchematicChangeSchema, SchematicSchema } from '@/server/mongo';
import type { SchematicChangeDocument, SchematicDocument } from '@/server/mongo';
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
export const get: RequestHandler = async (req) => {
  const access = UserAccess.from(req.locals.access);
  if (!access.can({ schematics: Access.deleteAll | Access.updateAll })) {
    return { status: 403, body: { message: 'Forbidden' } };
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
      _id: changes[i]._id,
      id: changes[i].id,
      mode: changes[i].Delete ? 'delete' : 'modify',
      name: originals[i]?.name || '[Deleted]',
    });
  }
  return {
    status: 200,
    body,
  };
};
