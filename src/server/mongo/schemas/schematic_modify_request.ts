import mongoose from 'mongoose';
import type { SchematicDocument } from './schematic';

const schema = new mongoose.Schema({
  schematic_id: { type: String, required: true },
  changes: { type: String, required: true },
  changed: { type: Object, required: true },
  status: { type: Number, required: true, default: 0 }
}, { timestamps: true });

export interface SchematicModifyRequestDocument extends mongoose.Document {
  id: string;
  changed: Omit<mongoose.LeanDocument<SchematicDocument>, '__v' | 'id' | '_id'>;
  changes: string;
  status: -1 | 0 | 1;
}

export const SchematicModifyRequestSchema: mongoose.Model<SchematicModifyRequestDocument> =
  mongoose.models.SchematicModifyRequests || mongoose.model('SchematicModifyRequests', schema);
