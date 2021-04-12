import mongoose, { LeanDocument } from 'mongoose';
import { SchematicDocument } from './Schematic';

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
  Changed: Omit<LeanDocument<SchematicDocument>, '__v' | 'id' | '_id'>;
  Description?: string;
  Delete?: string;
}
const SchematicChangeSchema = mongoose.model<SchematicChangeDocument>(
  'SchematicChanges',
  schema
);
export default SchematicChangeSchema;
