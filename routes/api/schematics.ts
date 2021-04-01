import { Router } from 'express';
import { Schematic } from 'mindustry-schematic-parser';
import SchematicChangeSchema from '../../schemas/SchematicChange.js';
import { SchematicRequest } from '../../routes/types.js';
import SchematicSchema from '../../schemas/Schematic.js';
import Tags from '../../tags.json';

const router = Router();

router.post('/parse', async (req, res) => {
  const { text } = req.body;
  if (!text || text === '') {
    res.status(400).send({ error: 'This is not a valid schematic' });
    return;
  }
  try {
    const decoded = decodeURIComponent(text);
    const schematic = Schematic.decode(decoded);

    res.send({
      name: schematic.name,
      description: schematic.description,
      powerProduction: schematic.powerProduction,
      powerConsumption: schematic.powerConsumption,
      requirements: schematic.requirements,
      image: (await schematic.toImageBuffer()).toString('base64'),
    });
  } catch (error) {
    let code = 500;
    if (error instanceof Error) {
      if (error.message.includes('valid')) code = 400;
    } else if (typeof error === 'string') {
      if (error.includes('valid')) code = 400;
    }
    res.status(code).send({
      error,
    });
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
      schematicName: newSchematic.name
    });
  } catch (error) {
    res.status(422).redirect(`/schematics`);
  }
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

  res.redirect(`/schematics`);
});

router.post('/:id/delete', async (req, res) => {
  const { schematic } = req as SchematicRequest;
  const { reason } = req.body;

  const schematicChange = {
    id: schematic._id,
    Delete: reason,
  };

  await new SchematicChangeSchema(schematicChange).save();

  res.redirect('/schematics');
});

export default router;
