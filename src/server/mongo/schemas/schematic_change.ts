import mongoose from 'mongoose';
import type { SchematicDocument } from './schematic';

const schema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    Changed: {
      type: Object,
    },

    Description: String,

    creator_id: {
      type: String,
      required: true,
    },

    Delete: String,
  },
  { timestamps: true },
);
export interface SchematicChangeDocument extends mongoose.Document {
  id: string;
  Changed?: Omit<mongoose.LeanDocument<SchematicDocument>, '__v' | 'id' | '_id'>;
  Description?: string;
  Delete?: string;
  creator_id: string;
}

export const SchematicChangeSchema: mongoose.Model<SchematicChangeDocument> =
  mongoose.models.SchematicChanges || mongoose.model('SchematicChanges', schema);
