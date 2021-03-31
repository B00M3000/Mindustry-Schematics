import { FilterQuery, Types } from 'mongoose';
import SchematicSchema, { SchematicDocument } from '../schemas/Schematic';
import { Router } from 'express';
import { Schematic } from 'mindustry-schematic-parser';
import { SchematicRequest } from './types';
import { safeDescription } from '../util';
import tags from '../tags.json';
const { ObjectId } = Types;
const avaliableTags = tags;
const limitPerPage = 20;
const router = Router();
export default router;
router.get('/', async (req, res) => {
  let page = Number(req.query.page);
  const query = String(req.query.query || '');
  const tags = String(req.query.tags || '');
  try {
    if (!page || isNaN(page) || page < 1 || page % 1 !== 0) page = 1;

    const skip = limitPerPage * (page - 1);

    let _query: FilterQuery<SchematicDocument> = {};
    if (query)
      _query = {
        name: new RegExp(query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i'),
      };
    if (tags)
      _query.tags = { $all: tags.split(' ').map((t) => t.replace(/_/g, ' ')) };

    const schematics = await SchematicSchema.find(
      _query,
      'id name image text',
      {
        skip,
        limit: limitPerPage,
      }
    );
    const documents = await SchematicSchema.countDocuments(_query);

    const pages =
      (documents % limitPerPage === 0
        ? documents / limitPerPage
        : Math.ceil(documents / limitPerPage)) || 1;

    if (page > pages)
      return res.redirect(
        `/next/?page=${pages}${query ? `&query=${query}` : ''}${
          tags ? `&tags=${tags}` : ''
        }`
      );

    res.render('next/index.pug', {
      skip,
      query,
      page,
      length: schematics.length,
      pages,
      documents,
      schematics,
      tags: avaliableTags,
      _tags: JSON.stringify(avaliableTags),
      queriedTags: tags,
    });
  } catch (e) {
    res.status(422).redirect('/next');
  }
});
router.param('id', async (req, res, next, id) => {
  const schematic = await SchematicSchema.findById(ObjectId(id));

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
router.get('/schematics', (req, res) => {
  res.redirect('/next');
});
router.get('/schematics/create', (req, res) => {
  res.render('next/create_schematic', {
    url: req.url,
    tags,
    _tags: JSON.stringify(tags),
  });
});
router.get('/schematics/:id', async (req, res) => {
  let { schematic } = req as SchematicRequest;
  schematic = (await SchematicSchema.findOneAndUpdate(
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
    avaliableTags.find((t) => t.name === name)
  );
  res.render('next/schematic', {
    url: req.url,
    schematic,
    tags,
    safeDescription: safeDescription(schematic.description || ''),
  });
});
router.get('/schematics/:id/edit', async (req, res) => {
  const { schematic } = req as SchematicRequest;

  res.render('next/edit_schematic', {
    schematic,
    tags,
    _tags: JSON.stringify(tags),
    previousTags: JSON.stringify(schematic.tags),
  });
});

router.get('/schematics/:id/delete', async (req, res) => {
  const { schematic } = req as SchematicRequest;

  schematic.description = safeDescription(schematic.description || '');
  res.render('next/delete_schematic', {
    schematic,
  });
});
