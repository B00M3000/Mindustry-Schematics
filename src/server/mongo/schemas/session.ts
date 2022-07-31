import mongoose from 'mongoose';

export interface SessionDocData {
  user_id: string;
}
const schema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
  },
  { timestamps: true },
);
export type SessionDocument = mongoose.HydratedDocument<SessionDocData>;

export const SessionSchema: mongoose.Model<SessionDocData> =
  mongoose.models.Sessions || mongoose.model('Sessions', schema);
