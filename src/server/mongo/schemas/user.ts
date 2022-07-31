import mongoose from 'mongoose';

export interface UserDocData {
  _id: string;
  id: string;
  username: string;
  discriminator: string;
  avatar_url: string;
  verified?: boolean;
  access?: string;
}

const schema = new mongoose.Schema<UserDocData>(
  {
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    discriminator: { type: String, required: true },
    avatar_url: { type: String, required: true },
    verified: { type: Boolean },
    access: { type: String },
  },
  { timestamps: true },
);

export type UserDocument = mongoose.HydratedDocument<UserDocData>;

export const UserSchema: mongoose.Model<UserDocData> =
  mongoose.models.Users || mongoose.model('Users', schema);
