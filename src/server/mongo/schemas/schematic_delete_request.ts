import mongoose from 'mongoose';
import type { SchematicDocument } from './schematic';

const schema = new mongoose.Schema({
  schematic_id: { type: String, required: true },
  reason: { type: String, required: true },
}, { timestamps: true });

export interface SchematicChangeDocument extends mongoose.Document {
  id: string;
  reason: string;
}

export const SchematicChangeSchema: mongoose.Model<SchematicChangeDocument> =
  mongoose.models.SchematicDeleteRequests || mongoose.model('SchematicDeleteRequests', schema);
