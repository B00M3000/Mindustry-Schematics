import SchematicSchema, { SchematicDocument } from '../../schemas/Schematic.js';
import { Router } from 'express';
import schematicChangeSchema from '../../schemas/SchematicChange.js';
import schematicsRouter from './schematics';
const router = Router();

router.use('/schematics', schematicsRouter);

router.get('/schematic-changes/:_id/image/original', async (req, res) => {
  const change = await schematicChangeSchema.findOne({ id: req.params._id });
  if (!change) return res.sendStatus(404);
  const original = (await SchematicSchema.findById(
    req.params._id
  )) as SchematicDocument;
  if (!original) res.sendStatus(400);
  res.type(original.image.ContentType);
  res.send(original.image.Data);
});
router.get('/schematic-changes/:_id/image/changed', async (req, res) => {
  const change = await schematicChangeSchema.findOne({ id: req.params._id });

  if (!change) return res.sendStatus(404);
  res.type(change.Changed.image.ContentType);
  res.send(change.Changed.image.Data.buffer);
});

export default router;
