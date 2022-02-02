import mongoose from 'mongoose';
import type { SchematicDocument } from './schematic';

const schema = new mongoose.Schema({
  schematic_id: { type: String, required: true },
  changes: { type: String, required: true },
  changed: { type: Object, required: true }
}, { timestamps: true });

export interface SchematicChangeDocument extends mongoose.Document {
  id: string;
  changed: Omit<mongoose.LeanDocument<SchematicDocument>, '__v' | 'id' | '_id'>;
  changes: string;
}

export const SchematicChangeSchema: mongoose.Model<SchematicChangeDocument> =
  mongoose.models.SchematicModifyRequests || mongoose.model('SchematicModifyRequests', schema);
