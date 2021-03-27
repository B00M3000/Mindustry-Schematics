import { SchematicDocument } from './Schematic';
import mongoose from 'mongoose';

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
  Changed: SchematicDocument;
  Description?: string;
  Delete?: string;
}
const SchematicChangeSchema = mongoose.model<SchematicChangeDocument>(
  'SchematicChanges',
  schema
);
export default SchematicChangeSchema;
