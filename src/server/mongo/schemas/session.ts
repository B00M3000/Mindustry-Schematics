import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  user_id: { type: String, required: true }
});
export interface UserDocument extends mongoose.Document {
  user_id: string;
}

export const UserSchema: mongoose.Model<UserDocument> =
  mongoose.models.Sessions || mongoose.model('Sessions', schema);
