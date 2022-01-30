import mongoose from 'mongoose';
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
}, { timestamps: true });
export interface SchematicChangeDocument extends mongoose.Document {
  id: string;
  Changed?: Omit<mongoose.LeanDocument<SchematicDocument>, '__v' | 'id' | '_id'>;
  Description?: string;
  Delete?: string;
}

export const SchematicChangeSchema: mongoose.Model<SchematicChangeDocument> =
  mongoose.models.SchematicChanges || mongoose.model('SchematicChanges', schema);
