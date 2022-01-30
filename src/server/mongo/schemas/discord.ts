import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true},
  username: { type: String, required: true },
  discriminator: { type: String, required: true },
  avatar_hash: { type: String },
  tag: { type: String, required: true },
}, { timestamps: true });
export interface DiscordDocument extends mongoose.Document {
  id: string;
  username: string;
  discriminator: string;
  tag: string;
  avatar_hash?: string;
}

export const DiscordSchema: mongoose.Model<DiscordDocument> =
  mongoose.models.Discords || mongoose.model('Discords', schema);
