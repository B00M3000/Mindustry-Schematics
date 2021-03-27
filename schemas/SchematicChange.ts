import mongoose from 'mongoose';
import { SchematicDocument } from './Schematic';

const schematicChangeSchema = new mongoose.Schema({
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

export default mongoose.model<SchematicChangeDocument>(
  'SchematicChanges',
  schematicChangeSchema
);
export interface SchematicChangeDocument extends mongoose.Document {
  id: string;
  Changed: SchematicDocument;
  Description?: string;
  Delete?: string;
}
