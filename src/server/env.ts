import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
/// preferred files to load environment variables, the first files on the array are the first to be used
const envs = ['.env.dev', '.env'];
function configEnv(): dotenv.DotenvParseOutput {
  for (const file of envs) {
    const filePath = path.resolve(file);
    if (fs.existsSync(filePath))
      return (
        dotenv.config({
          path: filePath,
        }).parsed || {}
      );
  }
  throw new Error('No .env files found');
}

interface Env {
  MONGO_USER: string | undefined;
  MONGO_PASS: string | undefined;
  MONGO_PATH: string | undefined;
  WEBHOOK_URL: string | undefined;
  WEBSITE_URL: string | undefined;
  ENABLE_WEBHOOKS: boolean;
  DISCORD_APPLICATION_ID: string | undefined
  DISCORD_APPLICATION_SECRET: string | undefined
}

const rawEnv = configEnv();

const env: Env = {
  ENABLE_WEBHOOKS: Boolean(rawEnv.ENABLE_WEBHOOKS ?? true),
  MONGO_PASS: rawEnv.MONGO_PASS,
  MONGO_PATH: rawEnv.MONGO_PATH,
  MONGO_USER: rawEnv.MONGO_USER,
  WEBHOOK_URL: rawEnv.WEBHOOK_URL,
  WEBSITE_URL: rawEnv.WEBSITE_URL,
  DISCORD_APPLICATION_ID: rawEnv.DISCORD_APPLICATION_ID,
  DISCORD_APPLICATION_SECRET: rawEnv.DISCORD_APPLICATION_SECRET
};

export default env;
