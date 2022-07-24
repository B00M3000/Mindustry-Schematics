import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  user_id: { type: String, required: true }
}, { timestamps: true });
export interface SessionDocument extends mongoose.Document {
  user_id: string;
}

export const SessionSchema: mongoose.Model<SessionDocument> =
  mongoose.models.Sessions || mongoose.model('Sessions', schema);