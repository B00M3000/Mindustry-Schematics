import { error, json } from '@sveltejs/kit';
import type { SchematicChangeInfoJSON } from '@/interfaces/json';
import { Access, accessLevels } from '@/lib/auth/access';
import { SchematicChangeSchema, SchematicSchema } from '@/server/mongo';
import type { SchematicChangeDocument, SchematicDocument } from '@/server/mongo';
import type { RequestHandler } from './$types';

type Changes = Pick<SchematicChangeDocument, 'id' | '_id' | 'Delete'>[];
type Originals = (Pick<SchematicDocument, 'name'> | null)[];
async function findOriginals(changes: Changes): Promise<Originals> {
  const promises = changes.map((change) =>
    SchematicSchema.findOne({ _id: change.id }, 'name'),
  );
  const originals = await Promise.all(promises);
  return originals;
}
export const GET: RequestHandler = async (req) => {
  const access = req.locals.user?.access ?? accessLevels.none;
  if (!access.can({ schematics: Access.deleteAll | Access.updateAll })) {
    throw error(403, 'Forbidden');
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
  return json(body);
};
