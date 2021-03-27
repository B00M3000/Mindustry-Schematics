import mongoose from 'mongoose';
const username = process.env.MONGO_USER || '';
const password = process.env.MONGO_PASS || '';
const database = process.env.MONGO_DATABASE_NAME || 'Schematics';

if (!process.env.MONGO_PATH) throw new Error('Mongo db path is not defined');

const path = process.env.MONGO_PATH.replace('<username>', username)
  .replace('<password>', password)
  .replace('<database>', database);

export default async () => {
  await mongoose.connect(path, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
  });

  return mongoose;
};
