import env from '@/server/env';
import mongoose from 'mongoose';

const uri = env.MONGO_URI
if (!uri) throw new Error('MongoDB uri is not defined in env.');

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async () => {
  if (mongoose.connections.length > 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(uri);
};

export * from './schemas/schematic';
export * from './schemas/schematic_change';
export * from './schemas/user';
export * from './schemas/session';
