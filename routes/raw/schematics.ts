import { Router } from 'express';
import { SchematicRequest } from '../../routes/types.js';
import schematicSchema from '../../schemas/Schematic.js';

const router = Router();

router.param('id', async (req, res, next, id) => {
  const schematic = await schematicSchema.findOne({ _id: id });

  if (!schematic) return res.redirect('/schematics');

  (req as any).schematic = schematic;

  next();
});

router.get('/:id/image', async (req, res) => {
  const { schematic } = req as SchematicRequest;

  res.type(schematic.image.ContentType);
  res.send(schematic.image.Data);
});

module.exports = router;
