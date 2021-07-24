import type { Locals } from '@/interfaces/app';
import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
let paths: string[] | undefined;
export const get: RequestHandler<Locals, unknown, string[]> = async () => {
  if (!paths)
    paths = fs
      .readdirSync(path.resolve('static/assets/backgrounds'))
      .map((file) => path.join('/assets/backgrounds', file).replace(/\\/g, '/'));
  return {
    status: 200,
    body: paths,
  };
};
