import mongoose from 'mongoose';
import type { SchematicDocument } from './schematic';

const schema = new mongoose.Schema({
  schematic_id: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: Number, required: true, default: 0 }
}, { timestamps: true });

export interface SchematicDeleteRequestDocument extends mongoose.Document {
  schematic_id: string;
  reason: string;
  status: -1 | 0 | 1;
}

export const SchematicDeleteRequestSchema: mongoose.Model<SchematicDeleteRequestDocument> =
  mongoose.models.SchematicDeleteRequests || mongoose.model('SchematicDeleteRequests', schema);
