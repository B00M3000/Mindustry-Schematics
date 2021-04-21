import mongodb from 'mongodb';
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  token: {
    type: String,
    unique: true,
    required: true
  },
  access: {
    type: String,
    required: true,
  }
});
export interface UserTokenDocument extends mongoose.Document {
  username: string,
  token: string,
  access: string,
}

const UserTokenSchema = mongoose.model<UserTokenDocument>('User Tokens', schema);
export default UserTokenSchema;
