<<<<<<< HEAD
import mongoose, { LeanDocument } from 'mongoose';
=======
import mongoose from 'mongoose';
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
import type { SchematicDocument } from './schematic';

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  Changed: {
    type: Object,
  },

  Description: String,

  Delete: String,
});
export interface SchematicChangeDocument extends mongoose.Document {
  id: string;
<<<<<<< HEAD
  Changed?: Omit<LeanDocument<SchematicDocument>, '__v' | 'id' | '_id'>;
=======
  Changed?: Omit<mongoose.LeanDocument<SchematicDocument>, '__v' | 'id' | '_id'>;
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
  Description?: string;
  Delete?: string;
}

export const SchematicChangeSchema: mongoose.Model<SchematicChangeDocument> =
  mongoose.models.SchematicChanges || mongoose.model('SchematicChanges', schema);
