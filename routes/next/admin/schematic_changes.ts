import { Request, Router } from 'express';
import SchematicChangeSchema, {
  SchematicChangeDocument,
} from '../../../schemas/SchematicChange';
import SchematicSchema, { SchematicDocument } from '../../../schemas/Schematic';

import avaliableTags from '../../../tags.json';
import { safeDescription } from '../../../util/index';

interface ModifiedSchematicChangeDocument extends SchematicChangeDocument {
  Original?: SchematicDocument | null;
}
interface SchematicChangeRequest extends Request {
  change: ModifiedSchematicChangeDocument;
}
const router = Router();
router.param('_id', async (req, res, next, _id) => {
  const change = await SchematicChangeSchema.findOne({ _id });

  if (!change) return res.redirect('/next/admin/schematic_changes');

  (req as SchematicChangeRequest).change = change;

  next();
});

router.get('/', async (req, res) => {
  const changes = await SchematicChangeSchema.find({});
  for (let i = 0; i < changes.length; i++) {
    const change = changes[i] as ModifiedSchematicChangeDocument;
    change.Original = await SchematicSchema.findOne({ _id: changes[i].id });
  }
  res.render('next/schematic_changes', {
    changes,
  });
});

router.get('/:_id', async (req, res) => {
  const { change } = req as SchematicChangeRequest;
  change.Original = await SchematicSchema.findOne({ _id: change.id });
  const originalTags =
    change.Original &&
    change.Original.tags.map((name) =>
      avaliableTags.find((t) => t.name === name)
    );
  const changedTags =
    change.Changed &&
    change.Changed.tags.map((name) =>
      avaliableTags.find((t) => t.name === name)
    );
  if (change.Original) {
    change.Original.description = safeDescription(
      change.Original.description || ''
    );
  }
  if (change.Changed) {
    change.Changed.description = safeDescription(
      change.Changed.description || ''
    );
  }
  if (change.Description) {
    change.Description = safeDescription(change.Description);
  }
  res.render('next/schematic_change', {
    change,
    originalTags,
    changedTags,
  });
});

router.get('/:_id/accept', async (req, res) => {
  const { change } = req as SchematicChangeRequest;

  if (change.Delete) {
    await SchematicSchema.deleteOne({
      _id: change.id,
    });
    await SchematicChangeSchema.deleteMany({
      id: change.id,
    });
  } else {
    await SchematicSchema.updateOne(
      {
        _id: change.id,
      },
      change.Changed
    );
    await SchematicChangeSchema.deleteOne({
      _id: change._id,
    });
  }

  res.redirect('/next/admin/schematic_changes');
});

router.get('/:_id/decline', async (req, res) => {
  const { change } = req as SchematicChangeRequest;

  await SchematicChangeSchema.deleteOne({
    _id: change._id,
  });

  res.redirect('/next/admin/schematic_changes');
});

export default router;
