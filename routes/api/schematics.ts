import type {
  SchematicParseErrorJSON,
  SchematicParseJSON,
  SchematicQueryJSON,
} from '@/interfaces/json.js';
import SchematicSchema, { SchematicDocument } from '../../schemas/Schematic.js';
import type { FilterQuery } from 'mongoose';
import { Router } from 'express';
import { Schematic } from 'mindustry-schematic-parser';
import SchematicChangeSchema from '../../schemas/SchematicChange.js';
import type { SchematicRequest } from '../../routes/types.js';
import Tags from '../../tags.json';

class SchematicSizeError extends Error {}

const router = Router();

const limitPerPage = 20;

router.get('/', async (req, res) => {
  let page = Number(req.query.page);
  const mode =
    req.query.mode === 'creator' ? ('creator' as const) : ('name' as const);
  const query = String(req.query.query || '');
  const tags = String(req.query.tags || '');
  try {
    if (!page || isNaN(page) || page < 1 || page % 1 !== 0) page = 1;

    const skip = limitPerPage * (page - 1);

    let _query: FilterQuery<SchematicDocument> = {};
    if (query)
      _query = {
        [mode]: new RegExp(query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i'),
      };
    if (tags)
      _query.tags = { $all: tags.split(' ').map((t) => t.replace(/_/g, ' ')) };

    const documents = await SchematicSchema.countDocuments(_query);

    const pages = Math.ceil(documents / limitPerPage) || 1;

    if (page > pages)
      return res.redirect(
        `/api/schematics?page=${pages}${query ? `&query=${query}` : ''}${
          tags ? `&tags=${tags}` : ''
        }`
      );

    const schematics = await SchematicSchema.find(_query, '_id name text', {
      skip,
      limit: limitPerPage,
      sort: {
        _id: -1,
      },
    });
    const data: SchematicQueryJSON = {
      skip,
      query,
      page,
      pages,
      documents,
      schematics,
      tags,
      mode,
    };
    res.send(data);
  } catch (e) {
    res.sendStatus(422);
  }
});

router.post('/parse', async (req, res) => {
  const { text } = req.body;
  if (!text || text === '') {
    res.status(400).send({ error: 'This is not a valid schematic' });
    return;
  }
  try {
    const decoded = decodeURIComponent(text);
    const schematic = Schematic.decode(decoded);
    const maxSize = 90;
    if (schematic.width > maxSize || schematic.height > maxSize) {
      const { height, width } = schematic;
      throw new SchematicSizeError(
        `The schematic size (${width}x${height}) is bigger than the allowed size (${maxSize}x${maxSize})`
      );
    }
    const data: SchematicParseJSON = {
      name: schematic.name,
      description: schematic.description,
      image: (await schematic.toImageBuffer()).toString('base64'),
    };
    res.send(data);
  } catch (error) {
    let code = 500;
    let message: string | undefined;
    if (error instanceof Error) {
      if (error.message.includes('valid')) code = 400;
      else if (error instanceof SchematicSizeError) {
        code = 400;
        ({ message } = error);
      }
    } else if (typeof error === 'string') {
      if (error.includes('valid')) code = 400;
    }
    const data: SchematicParseErrorJSON = {
      error: { message },
    };
    res.status(code).send(data);
  }
});
type Tag = {
  name: string;
  color: string;
};
router.post('/create', async (req, res) => {
  let { name, author, creator, text, description } = req.body;
  try {
    const schematic = Schematic.decode(text);

    const tags = (JSON.parse(req.body.tags) as Tag[])
      .map((tag) => tag.name)
      .filter((n) => Tags.find((t) => t.name === n));

    const {
      powerBalance,
      powerConsumption,
      powerProduction,
      requirements,
    } = schematic;
    const data = await schematic.toImageBuffer();
    const mimetype = 'image/png';

    schematic.name = name;
    schematic.description = description;

    text = schematic.encode();

    const newSchematic = {
      name,
      creator: creator || author,
      tags: tags,
      text,
      description,
      encoding_version: schematic.version,
      powerBalance,
      powerConsumption,
      powerProduction,
      requirements,
      image: {
        Data: data,
        ContentType: mimetype,
      },
    };

    // eslint-disable-next-line new-cap
    const { id } = await new SchematicSchema(newSchematic).save();

    res.status(200).redirect(`/schematics/${id}`);
    req.app.get('eventHandler').createSchematic({
      triggeredAt: new Date().getTime(),
      schematicId: id,
      schematicName: newSchematic.name,
    });
  } catch (error) {
    res.status(422).redirect(`/schematics`);
  }
});

router.get('/:id', async (req, res) => {
  const schematic = await SchematicSchema.findOne(
    { _id: req.params.id },
    '-image'
  );
  if (!schematic) return res.sendStatus(404);

  res.send(schematic);
});
router.param('id', async (req, res, next, id) => {
  const schematic = await SchematicSchema.findOne({ _id: id });

  if (!schematic) return res.redirect('/schematics');

  (req as SchematicRequest).schematic = schematic;

  next();
});

router.post('/:id/edit', async (req, res) => {
  const originalSchematic = (req as SchematicRequest).schematic;
  let {
    name,
    author,
    creator,
    text,
    description,
    tags,
    cDescription,
  } = req.body;

  try {
    tags = (JSON.parse(tags) as Tag[])
      .map((tag) => tag.name)
      .filter((n) => Tags.find((t) => t.name === n));
  } catch (error) {
    tags = undefined;
  }

  const schematic = Schematic.decode(text);
  const {
    powerBalance,
    powerConsumption,
    powerProduction,
    requirements,
  } = schematic;
  const data = await schematic.toImageBuffer();
  const mimetype = 'image/png';

  schematic.name = name;
  schematic.description = description;

  text = schematic.encode();

  const changedSchematic = {
    name,
    creator: creator || author,
    tags: tags,
    text,
    description,
    encoding_version: schematic.version,
    powerBalance,
    powerConsumption,
    powerProduction,
    requirements,
    image: {
      Data: data,
      ContentType: mimetype,
    },
  };

  const schematicChange = {
    id: originalSchematic._id,
    Changed: changedSchematic,
    Description: cDescription,
  };

  // eslint-disable-next-line new-cap
  await new SchematicChangeSchema(schematicChange).save();

  res.redirect(`/schematics/${originalSchematic._id}`);
});

router.post('/:id/delete', async (req, res) => {
  const { schematic } = req as SchematicRequest;
  const { reason } = req.body;

  const schematicChange = {
    id: schematic._id,
    Delete: reason,
  };

  await new SchematicChangeSchema(schematicChange).save();

  res.redirect(`/schematics/${schematic._id}`);
});

export default router;
