import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true},
  username: { type: String, required: true },
  discriminator: { type: String, required: true },
  avatar_url: { type: String, required: true },
  verified: { type: Boolean },
  access: { type: String },
}, { timestamps: true });

export interface UserDocument extends mongoose.Document {
  id: string;
  username: string;
  discriminator: string;
  avatar_url: string;
  verified?: boolean;
  access?: string;
}

export const UserSchema: mongoose.Model<UserDocument> =
  mongoose.models.Users || mongoose.model('Users', schema);