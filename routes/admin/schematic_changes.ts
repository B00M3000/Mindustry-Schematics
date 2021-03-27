import { Router, Request } from 'express';
import schematicChangeSchema, {
  SchematicChangeDocument,
} from '../../schemas/SchematicChange.js';
import schematicSchema, { SchematicDocument } from '../../schemas/Schematic.js';
import avaliableTags from '../../tags.json';
import { safeDescription } from '../../util';

interface SchematicChangeRequest extends Request {
  change: ModifiedSchematicChangeDocument;
}
interface ModifiedSchematicChangeDocument extends SchematicChangeDocument {
  Original?: SchematicDocument | null;
}
const router = Router();
router.param('_id', async (req, res, next, _id) => {
  const change = await schematicChangeSchema.findOne({ _id });

  if (!change) return res.redirect('/admin/schematic_changes');

  (req as SchematicChangeRequest).change = change;

  next();
});

router.get('/', async (req, res) => {
  var changes = await schematicChangeSchema.find({});
  for (var i = 0; i < changes.length; i++) {
    const change = changes[i] as ModifiedSchematicChangeDocument;
    change.Original = await schematicSchema.findOne({ _id: changes[i].id });
  }
  res.render('schematic_changes', {
    changes,
  });
});

router.get('/:_id', async (req, res) => {
  const { change } = req as SchematicChangeRequest;
  change.Original = await schematicSchema.findOne({ _id: change.id });
  const originalTags =
    change.Original &&
    change.Original.tags.map((name) =>
      avaliableTags.find((t) => t.name == name)
    );
  const changedTags =
    change.Changed &&
    change.Changed.tags.map((name) =>
      avaliableTags.find((t) => t.name == name)
    );
  console.log(change);
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
  res.render('schematic_change', {
    change,
    originalTags,
    changedTags,
  });
});

router.get('/:_id/accept', async (req, res) => {
  const { change } = req as SchematicChangeRequest;

  if (change.Delete) {
    await schematicSchema.deleteOne({
      _id: change.id,
    });
    await schematicChangeSchema.deleteMany({
      id: change.id,
    });
  } else {
    await schematicSchema.updateOne(
      {
        _id: change.id,
      },
      change.Changed
    );
    await schematicChangeSchema.deleteOne({
      _id: change._id,
    });
  }

  res.redirect('/admin/schematic_changes');
});

router.get('/:_id/decline', async (req, res) => {
  const { change } = req as SchematicChangeRequest;

  await schematicChangeSchema.deleteOne({
    _id: change._id,
  });

  res.redirect('/admin/schematic_changes');
});

export default router;
