import { Router } from 'express';
import { Schematic } from 'mindustry-schematic-parser';
import { Types } from 'mongoose';
import tags from '../tags.json';
import schematicSchema, { SchematicDocument } from '../schemas/Schematic';
import { safeDescription } from '../util';
import 'tslib';
import { SchematicRequest } from './types';

const router = Router();
const { ObjectId } = Types;
const avaliableTags = tags;

const limitPerPage = 20;

router.get('/', async (req, res) => {
  let page = Number(req.query.page);
  let query = String(req.query.query);
  let tags = String(req.query.tags);
  try {
    if (!page || isNaN(page) || Number(page) < 1 || Number(page) % 1 != 0)
      page = 1;

    const skip = limitPerPage * (page - 1);

    let _query: any = {};
    if (query)
      _query = {
        name: new RegExp(query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i'),
      };

    let _tags = undefined;
    if (tags) _query.tags = { $all: tags.split(' ') };

    const schematics = await schematicSchema.find(
      _query,
      'id name image text',
      { skip, limit: limitPerPage }
    );
    const documents = await schematicSchema.countDocuments();

    const pages =
      (documents % limitPerPage == 0
        ? documents / limitPerPage
        : Math.floor(documents / limitPerPage) + 1) || 1;

    if (page > pages)
      return res.redirect(
        `/schematics?page=${pages}${query ? `&query=${query}` : ''}${
          tags ? `&tags=${tags}` : ''
        }`
      );

    res.render('schematics', {
      skip,
      query,
      page,
      length: schematics.length,
      pages,
      documents,
      schematics,
      tags: avaliableTags,
      _tags: JSON.stringify(avaliableTags),
    });
  } catch (e) {
    res.status(422).redirect('/schematics');
  }
});

router.get('/create', (req, res) => {
  res.render('create_schematic', {
    url: req.url,
    tags,
    _tags: JSON.stringify(tags),
  });
});

router.post('/create', async (req, res) => {
  const schematics = await schematicSchema.find({});
  const { name, author, creator, text, description, tags } = req.body;

  const schematic = Schematic.decode(text);
  const {
    powerBalance,
    powerConsumption,
    powerProduction,
    requirements,
  } = schematic;
  const data = await schematic.toImageBuffer();
  const mimetype = 'image/png';
  const newSchematic = {
    name,
    creator: creator == undefined ? author : creator,
    text,
    description,
    encoding_version: schematic.version,
    powerBalance,
    powerConsumption,
    powerProduction,
    requirements,
    tags: JSON.parse(tags),
    image: {
      Data: data,
      ContentType: mimetype,
    },
  };

  const { id } = await new schematicSchema(newSchematic).save();

  res.redirect(`/schematics/${id}`);
});

router.param('id', async (req, res, next, id) => {
  const schematic = await schematicSchema.findById(ObjectId(id));

  if (!schematic) return res.redirect('/schematics');
  (req as SchematicRequest).schematic = schematic;

  next();
});

router.get('/:id/text', async (req, res) => {
  const { schematic } = req as SchematicRequest;

  const _schematic = Schematic.decode(schematic.text);

  _schematic.name = schematic.name;
  _schematic.description = schematic.description;

  const text = _schematic.encode();

  res.send(text);
});

router.get('/:id', async (req, res) => {
  let { schematic } = req as SchematicRequest;
  schematic = (await schematicSchema.findOneAndUpdate(
    { _id: schematic._id },
    {
      $inc: {
        views: 1,
      },
    },
    {
      new: true,
    }
  )) as SchematicDocument;
  const tags = schematic.tags.map((name) =>
    avaliableTags.find((t) => t.name == name)
  );
  schematic.description = safeDescription(schematic.description || '');
  res.render('schematic_info', {
    url: req.url,
    schematic,
    tags,
  });
});

router.get('/:id/edit', async (req, res) => {
  const { schematic } = req as SchematicRequest;

  res.render('edit_schematic', {
    schematic,
    tags,
    _tags: JSON.stringify(tags),
    previousTags: JSON.stringify(schematic.tags),
  });
});

router.get('/:id/delete', async (req, res) => {
  const { schematic } = req as SchematicRequest;

  schematic.description = safeDescription(schematic.description || '');
  res.render('delete_schematic', {
    schematic,
  });
});

export default router;