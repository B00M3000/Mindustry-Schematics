import { error, json } from '@sveltejs/kit';
import type {
  SchematicChangeInfoJSON,
  SchematicChangeInfoQueryJSON,
} from '@/interfaces/json';
import { Access, accessLevels } from '@/lib/auth/access';
import { SchematicChangeSchema, SchematicSchema } from '@/server/mongo';
import type { SchematicChangeDocument, SchematicDocument } from '@/server/mongo';
import type { RequestHandler } from './$types';
import { getPaginatedQueryPosition } from '@/server/schematic_pagination';
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

const limitPerPage = 20;

export const GET: RequestHandler = async ({ locals, url }) => {
  const access = locals.user?.access ?? accessLevels.none;
  if (!access.can({ schematics: Access.deleteAll | Access.updateAll })) {
    throw error(403, 'Forbidden');
  }

  const searchPage = Number(url.searchParams.get('page')) || 1;
  const documents = await SchematicChangeSchema.countDocuments();
  const { page, pages, skip } = getPaginatedQueryPosition({
    documents,
    limitPerPage,
    page: searchPage,
  });

  const changes: Changes = await SchematicChangeSchema.find({}, 'id _id Delete', {
    skip,
    limit: limitPerPage,
    sort: {
      _id: -1,
    },
  });
  const originals = await findOriginals(changes);

  const changeInfo: SchematicChangeInfoJSON[] = [];
  for (let i = 0; i < changes.length; i++) {
    changeInfo.push({
      _id: changes[i]._id,
      id: changes[i].id,
      mode: changes[i].Delete ? 'delete' : 'modify',
      name: originals[i]?.name || '[Deleted]',
    });
  }
  return json({
    changes: changeInfo,
    documents,
    page,
    pages,
    skip,
  } satisfies SchematicChangeInfoQueryJSON);
};
