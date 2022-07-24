import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

/** The server side environment variables of this project*/
interface Env {
  PORT?: string;
  MONGO_DATABASE_NAME?: string;
  MONGO_USER?: string;
  MONGO_PASS?: string;
  MONGO_PATH?: string;
  WEBHOOK_URL?: string;
  WEBSITE_URL?: string;
  ENABLE_WEBHOOKS: string;
  PRIVATE_WEBHOOK_URL?: string;
  PUBLIC_WEBHOOK_URL?: string;
  DISCORD_APPLICATION_ID?: string;
  DISCORD_APPLICATION_SECRET?: string;
}

type RawEnv = {
  [K in keyof Env]?: string;
};

/** preferred files to load environment variables, the first files on the array are the first to be used */
const envs = ['.env.dev', '.env'];
function configEnv(): RawEnv {
  for (const file of envs) {
    const filePath = path.resolve(file);
    if (fs.existsSync(filePath))
      return (
        dotenv.config({
          path: filePath,
        }).parsed || {}
      );
  }
  dotenv.config();
  return process.env as RawEnv;
}

// the raw env has all its values contained as strings
// non string values must be converted manually (see bellow)
const rawEnv = configEnv();

// the spread operator will automatically assign the string properties
// and we override non string properties putting them after
// the spread operator
const env: Env = {
  ...rawEnv,
  ENABLE_WEBHOOKS: rawEnv.ENABLE_WEBHOOKS?.toLowerCase() == 'true',
};

export default env;
