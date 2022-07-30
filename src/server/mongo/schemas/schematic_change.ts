import mongoose from 'mongoose';
import type { SchematicDocData } from './schematic';

export interface SchematicChangeDocData {
  id: string;
  Changed?: SchematicDocData;
  Description?: string;
  Delete?: string;
  creator_id: string;
}

const schema = new mongoose.Schema<SchematicChangeDocData>(
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

export type SchematicChangeDocument = mongoose.HydratedDocument<SchematicChangeDocData>;

export const SchematicChangeSchema: mongoose.Model<SchematicChangeDocData> =
  mongoose.models.SchematicChanges || mongoose.model('SchematicChanges', schema);
