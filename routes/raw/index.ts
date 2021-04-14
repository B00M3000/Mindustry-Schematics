import { Router } from 'express';
import schematicChangeSchema from '../../schemas/SchematicChange.js';
import schematicsRouter from './schematics';
const router = Router();

router.use('/schematics', schematicsRouter);

router.get('/schematic-changes/:_id/image', async (req, res) => {
  const change = await schematicChangeSchema.findOne({ id: req.params._id });
  if (!change) return res.sendStatus(404);

  res.type(change.Changed.image.ContentType);
  res.send(change.Changed.image.Data.buffer);
});

export default router;
