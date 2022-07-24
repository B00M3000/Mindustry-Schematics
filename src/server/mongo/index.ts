import env from '@/server/env';
import mongoose from 'mongoose';

const username = env.MONGO_USER || '';
const password = env.MONGO_PASS || '';
const database = env.MONGO_DATABASE_NAME || 'Schematics';

if (!env.MONGO_PATH) throw new Error('Mongo db path is not defined');

const path = env.MONGO_PATH.replace('<username>', username)
  .replace('<password>', password)
  .replace('<database>', database);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default () => mongoose.connect(path);

export * from './schemas/schematic';
export * from './schemas/schematic_change';
export * from './schemas/user';
export * from './schemas/session';
