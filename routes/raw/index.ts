import { Router } from 'express';
import schematicChangeSchema from '../../schemas/SchematicChange.js';
import { Schematic } from 'mindustry-schematic-parser';

const router = Router();

router.use('/schematics', require('./schematics'));

router.get('/schematic-changes/:_id/image', async (req, res) => {
  const change = await schematicChangeSchema.findOne({ _id: req.params._id });
  if (!change) return res.sendStatus(404);

  res.type(change.Changed.image.ContentType);
  res.send(await Schematic.decode(change.Changed.text).toImageBuffer());
});

export default router;
