import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true },
  discriminator: { type: String, required: true },
  avatar_hash: { type: String },
  avatar_url: { type: String },
  tag: { type: String, required: true },
});
export interface UserDocument extends mongoose.Document {
  id: string;
  username: string;
  discriminator: string;
  tag: string;
  avatar_hash?: string;
  avatar_url?: string;
}

export const UserSchema: mongoose.Model<UserDocument> =
  mongoose.models.Users || mongoose.model('Users', schema);
