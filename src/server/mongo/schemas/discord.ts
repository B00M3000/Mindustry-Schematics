import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true },
  discriminator: { type: String, required: true },
  avatar_hash: { type: String },
  avatar_url: { type: String },
  tag: { type: String, required: true },
  verified: { type: Boolean },
  access: { type: String, required: true, default: 'none' },
});
export interface DiscordDocument extends mongoose.Document {
  id: string;
  username: string;
  discriminator: string;
  tag: string;
  avatar_hash?: string;
  avatar_url?: string;
  verified?: boolean;
  access: string;
}

export const DiscordSchema: mongoose.Model<DiscordDocument> =
  mongoose.models.Discord || mongoose.model('Discords', schema);
