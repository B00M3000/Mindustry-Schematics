import { Router } from 'express';
import { Schematic } from 'mindustry-schematic-parser';
import schematicChangeSchema from '../../schemas/SchematicChange.js';
import schematicsRouter from './schematics';
const router = Router();

router.use('/schematics', schematicsRouter);

router.get('/schematic-changes/:_id/image', async (req, res) => {
  const change = await schematicChangeSchema.findOne({ _id: req.params._id });
  if (!change) return res.sendStatus(404);

  res.type(change.Changed.image.ContentType);
  res.send(await Schematic.decode(change.Changed.text).toImageBuffer());
});

export default router;
