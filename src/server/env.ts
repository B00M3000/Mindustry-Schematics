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

const env = configEnv();
export default env;
