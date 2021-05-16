import { FilterQuery, Types } from 'mongoose';
import SchematicSchema, { SchematicDocument } from '../schemas/Schematic';
import { Router } from 'express';
import { Schematic } from 'mindustry-schematic-parser';
import { SchematicRequest } from './types';
import Tags from '../tags.json';
import { parseTags } from '../util/parse_tags';
import { safeDescription } from '../util';
const { ObjectId } = Types;
const limitPerPage = 20;
const router = Router();
export default router;
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
        `/?page=${pages}${query ? `&query=${query}` : ''}${
          tags ? `&tags=${tags}` : ''
        }`
      );

    const schematics = await SchematicSchema.find(
      _query,
      'id name image text',
      {
        skip,
        limit: limitPerPage,
        sort: {
          _id: -1,
        },
      }
    );

    res.render('index.pug', {
      skip,
      query,
      page,
      length: schematics.length,
      pages,
      documents,
      schematics,
      tags: Tags,
      _tags: JSON.stringify(Tags),
      queriedTags: tags,
      mode,
    });
  } catch (e) {
    res.status(422).redirect('/');
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
  const search = new URLSearchParams();
  for (const key in req.query) {
    const value = req.query[key];
    if (value) search.set(key, String(value));
  }
  if (search.toString()) {
    res.redirect(`/?${search}`);
    return;
  }
  res.redirect('/');
});
router.get('/schematics/create', (req, res) => {
  res.render('create_schematic', {
    url: req.url,
    tags: Tags,
    _tags: JSON.stringify(Tags),
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
  const tags = parseTags(schematic.tags);
  res.render('schematic', {
    url: req.url,
    schematic,
    tags,
    safeDescription: safeDescription(schematic.description || ''),
  });
});
router.get('/schematics/:id/edit', async (req, res) => {
  const { schematic } = req as SchematicRequest;

  res.render('edit_schematic', {
    schematic,
    tags: Tags,
    _tags: JSON.stringify(Tags),
    previousTags: JSON.stringify(schematic.tags),
  });
});

router.get('/schematics/:id/delete', async (req, res) => {
  const { schematic } = req as SchematicRequest;

  schematic.description = safeDescription(schematic.description || '');
  res.render('delete_schematic', {
    schematic,
  });
});
