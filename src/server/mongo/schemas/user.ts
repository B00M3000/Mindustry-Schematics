import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  username: { type: String, required: true },
  verified: { type: Boolean },
  access: { type: String, required: true, default: 'none' },
  discord_id: { type: String },
  avatar: String
}, { timestamps: true });
export interface UserDocument extends mongoose.Document {
  username: string;
  verified?: boolean;
  access: string;
  discord_id?: string;
}

export const UserSchema: mongoose.Model<UserDocument> =
  mongoose.models.Users || mongoose.model('Users', schema);
