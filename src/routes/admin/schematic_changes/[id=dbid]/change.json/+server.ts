import { error, json } from '@sveltejs/kit';
import type { SchematicChangeJSON } from '@/interfaces/json';
import { Access, accessLevels } from '@/lib/auth/access';
import { SchematicChangeSchema, SchematicSchema } from '@/server/mongo';
import type { SchematicDocument } from '@/server/mongo';
import type { RequestHandler } from './$types';
import { Schematic, arc, mindustry } from 'mindustry-schematic-parser';

const { Item, Liquid } = mindustry;
const { Point2 } = arc;

function renderAsSame(...schematics: [string, string]): boolean {
  const a = Schematic.decode(schematics[0]),
    b = Schematic.decode(schematics[1]);
  if (a.width != b.width || a.height != b.height) return false;
  if (a.tiles.length != b.tiles.length) return false;
  const size = a.tiles.length;
  for (let i = 0; i < size; i++) {
    const tileA = a.tiles[i],
      tileB = b.tiles[i];
    if (
      tileA.block.name != tileB.block.name ||
      tileA.rotation != tileB.rotation ||
      tileA.x != tileB.x ||
      tileA.y != tileB.y
    )
      return false;
    const configA = tileA.config,
      configB = tileB.config;
    if (
      configA instanceof Point2 &&
      configB instanceof Point2 &&
      !configA.equals(configB)
    )
      return false;
    if (
      configA instanceof Item &&
      configB instanceof Item &&
      configA.code != configB.code
    )
      return false;
    if (
      configA instanceof Liquid &&
      configB instanceof Liquid &&
      configA.name != configB.name
    )
      return false;
  }
  return true;
}
export const GET: RequestHandler = async ({ params, locals }) => {
  const access = locals.user?.access ?? accessLevels.none;
  if (
    !access.can({
      schematics: Access.deleteAll | Access.updateAll,
    })
  )
    throw error(403, 'Forbidden');

  const change = await SchematicChangeSchema.findOne(
    { _id: params.id },
    {
      _id: true,
      id: true,
      creator_id: true,
      Delete: true,
      Changed: {
        name: true,
        creator_id: true,
        tags: true,
        description: true,
        image: true,
        text: true,
      },
      Description: true,
    },
  );
  if (!change) throw error(404, 'Not Found');
  const mode = change?.Delete ? 'delete' : 'modify';
  const original = await SchematicSchema.findOne(
    { _id: change.id },
    {
      name: true,
      creator_id: true,
      tags: true,
      description: true,
      image: true,
      text: true,
    },
  );
  const differentImages = Boolean(
    change.Changed && original && !renderAsSame(change.Changed.text, original.text),
  );
  // const differentImages =
  // 	change.Changed && original
  // 		? Buffer.compare(
  // 				Buffer.from(change.Changed.image.Data.buffer),
  // 				Buffer.from(original.image.Data.buffer),
  // 		  ) == 0
  // 		: false;
  const body: SchematicChangeJSON = {
    change,
    creator_id: change.creator_id,
    mode,
    original,
    differentImages,
  };
  if (body.change.Changed) {
    const changed: Partial<typeof body.change.Changed> = body.change.Changed;
    delete changed.image;
    delete changed.text;
  }
  if (body.original) {
    const original: Partial<SchematicDocument> = body.original;
    delete original.image;
    delete original.text;
  }
  return json(body);
};
