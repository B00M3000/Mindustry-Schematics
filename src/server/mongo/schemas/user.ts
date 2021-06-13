import type mongodb from 'mongodb';
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  discord_id: { type: String, required: true },
  access_token: { type: String, required: true },
  token_type: { type: String, required: true },
  username: { type: String, required: true },
  avatarURL: { type: String }
});
export interface UserDocument extends mongoose.Document {
  discord_id: string,
  access_token: string,
  token_type: string,
  username: string,
  avatarURL?: string,
}

export const UserSchema: mongoose.Model<UserDocument> =
  mongoose.models.Users || mongoose.model('Users', schema);
