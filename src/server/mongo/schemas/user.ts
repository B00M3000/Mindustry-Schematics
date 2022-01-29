import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  id: { type: String, required: true },
  discord_id: String
});
export interface UserDocument extends mongoose.Document {
  id: string;
  discord_id?: string;
}

export const UserSchema: mongoose.Model<UserDocument> =
  mongoose.models.Users || mongoose.model('Users', schema);
